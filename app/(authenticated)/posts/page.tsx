"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComment,
  faBookmark,
  faEllipsisVertical,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useSession } from "@clerk/nextjs";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

interface User {
  id: String;
  name: string;
  description: string;
  university: string;
  imageUrl: string;
  friendList: string[];
}

interface Post {
  id: String;
  userName: string;
  userId: string;
  userProfileImage: string;
  description: string;
  imageUrl: string;
  likes: string[];
  comments: number;
  timeStamp: Timestamp;
}

export default function Posts() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [userImage, setUserImage] = useState<string>("");
  const [postImageUrl, setPostImageUrl] = useState<string>("");
  const session = useSession();
  const user = session.session?.user;
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [postList, setPostList] = useState<Post[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const firebaseConfig = {
    apiKey: "AIzaSyBvdsAlLvHfijS2xYnSserphmfPNiwc9q0",
    authDomain: "cb-backend-90a12.firebaseapp.com",
    projectId: "cb-backend-90a12",
    storageBucket: "cb-backend-90a12.appspot.com",
    messagingSenderId: "1001305396798",
    appId: "1:1001305396798:web:1b09bb2a3e8e6f08e5636f",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const fetchPostFromFirestore = async () => {
    try {
      const docRef = doc(db, "users", user?.id ?? "1001");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      setCurrentUser({
        id: docSnap.id,
        name: data?.name,
        description: data?.designation,
        university: data?.university,
        imageUrl: data?.profile_image,
        friendList: data?.friendList,
      });
      const col = collection(db, "posts");
      const q = query(col, orderBy("timeStamp", "desc"));
      const itemSnapshot = await getDocs(q);
      const fetchedPosts: Post[] = [];
      itemSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (
          data?.friendList.includes(userData.userId) ||
          userData.userId == user?.id.toString()
        ) {
          fetchedPosts.push({
            id: doc.id,
            userName: userData.userName,
            userId: userData.userId,
            description: userData.description,
            imageUrl: userData.imageUrl,
            userProfileImage: userData.userProfileImage,
            likes: userData.likes,
            comments: userData.comments,
            timeStamp: userData.timeStamp,
          });
        }
      });
      setPostList(fetchedPosts);
    } catch (error) {
      console.log("Error fetching data from Firestore:" + error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setUserImage(user?.imageUrl ?? "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchPostFromFirestore();
    fetchUserProfile();
  }, [user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    closeModal();
    if (file) {
      const storageRef = ref(storage, `post_images/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file);
      await uploadTask.then((snapshot) => {});
      const downloadURL = await getDownloadURL(storageRef);
      const col = collection(db, "posts");
      await addDoc(col, {
        imageUrl: downloadURL,
        userName: session.session?.user.fullName,
        userId: session.session?.user.id,
        description: text,
        userProfileImage: session.session?.user.imageUrl,
        likes: [],
        comments: [],
        timeStamp: Timestamp.now(),
      });
    }
    setText("");
    setUploading(false);
  };

  const formatDate = (timestamp: Timestamp): string => {
    const date = timestamp.toDate();
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const changeLikes = async (likes: string[], userId: string, id: string) => {
    const docRef = doc(db, "posts", id);
    if (likes.includes(userId)) {
      likes = likes.filter((l) => l != userId);
    } else {
      likes.push(userId);
    }
    await updateDoc(docRef, {
      likes: likes,
    });
    fetchPostFromFirestore();
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 py-6 flex flex-col items-center rounded-lg w-[750px]">
            <div className="w-full pr-12 flex flex-row items-center justify-end">
              <button
                className="primary-green font-base border-green-900"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
            <div className="w-full flex flex-row justify-start ml-24">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4 mt-5 appearance-none border border-gray-300 rounded-md py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <textarea
              className="w-[650px] h-40 mt-3 rounded-lg bg-slate-700 text-white resize-none p-4 py-5"
              placeholder="Write something..."
              value={text}
              onChange={handleChange}
            />
            <div className="flex flex-row justify-center mb-2">
              <button
                className="mt-5 bg-primary-green primary-green font-semibold rounded-full px-7 py-[6px] border border-green-900"
                onClick={handleUpload}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-[calc(75vw)] p-5 flex flex-col gap-5 justify-center items-center">
        {uploading && (
          <div className="primary-green font-base">Uploading post...</div>
        )}
        <div className="w-1/2 border border-zinc-700 rounded-md bg-black-700 p-4 flex flex-row items-center gap-5">
          <div className="w-9 h-9">
            <Image
              className="w-full h-full rounded-full"
              alt="post"
              width={100}
              height={100}
              src={userImage}
            ></Image>
          </div>
          <div className="relative w-full">
            <input
              className="pl-5 pr-4 py-[8px] w-full rounded-lg  focus:outline-none bg-slate-800"
              type="text"
              onClick={openModal}
              placeholder="Create Post"
            />
          </div>
        </div>
        {postList.map((post) => {
          const formattedDate = formatDate(post.timeStamp);
          const likeColor = post.likes.includes(user?.id ?? "")
            ? "text-blue-600"
            : "text-white";
          return (
            <div
              key={post.timeStamp.toString()}
              className="w-1/2 border border-zinc-700 rounded-md bg-black p-6 flex flex-col"
            >
              <div className="gap-3 pb-8 flex flex-row items-center">
                <div className="w-10 h-10 mr-2">
                  <Image
                    className="w-full h-full rounded-full "
                    alt="post"
                    width={110}
                    height={110}
                    src={post.userProfileImage}
                  ></Image>
                </div>
                <div className="flex flex-col items-start">
                  <div className="primary-green font-semibold">
                    {post.userName}
                  </div>
                  <div className="text-zinc-400 text-xs">{formattedDate}</div>
                </div>
                <div className="ml-auto">
                  <FontAwesomeIcon
                    className="w-5 h-5 pr-1"
                    icon={faEllipsisVertical}
                  />
                </div>
              </div>
              <Image
                className="w-full h-full max-h-[calc(60vh)]"
                alt="post"
                width={500}
                height={300}
                src={post.imageUrl}
              ></Image>
              <div className="pt-8 text-white  font-light">
                {post.description}
              </div>
              <div className="pt-4 flex flex-row gap-10">
                <button
                  className={`${post.likes.includes(
                    user?.id ? "text-blue-600" : "text-red-400"
                  )}`}
                  onClick={() =>
                    changeLikes(post.likes, user?.id ?? "", post.id.toString())
                  }
                >
                  <FontAwesomeIcon
                    className={`w-5 h-5 pr-2 text-xl ${likeColor}`}
                    icon={faThumbsUp}
                  />
                  {post.likes.length}
                </button>
                <div>
                  <FontAwesomeIcon
                    className="w-5 h-5 pr-2 text-xl"
                    icon={faComment}
                  />
                  {post.comments}
                </div>
                {/* <div>
                  <FontAwesomeIcon className="w-5 h-5" icon={faShare} />
                </div>
                <div className="ml-auto">
                  <FontAwesomeIcon className="w-5 h-5" icon={faBookmark} />
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
