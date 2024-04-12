"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons/faMessage";
import { faPaperPlane, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@clerk/nextjs";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

interface User {
  id: String;
  name: string;
  description: string;
  university: string;
  imageUrl: string;
  friendList: string[];
}

interface Message {
  id: String;
  to: string;
  from: string;
  message: string;
  timeStamp: Timestamp;
}

const MessagesPage: React.FC = () => {
  const session = useSession();
  const user = session.session?.user;
  const [searchText, setSearchText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [userImage, setUserImage] = useState<string>("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [userResult, setUserResult] = useState<User[]>([]);
  const [searchList, setSearchList] = useState<User[]>([]);
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

  const fetchUsersFromFirestore = async () => {
    try {
      const col = collection(db, "users");
      const itemSnapshot = await getDocs(col);
      const fetchedUsers: User[] = [];
      itemSnapshot.forEach((doc) => {
        const userData = doc.data();
        fetchedUsers.push({
          id: doc.id,
          name: userData.name,
          description: userData.designation,
          university: userData.university,
          imageUrl: userData.profile_image,
          friendList: userData.friendList,
        });
      });
      const currentUser: User | undefined = fetchedUsers.findLast(
        (item) => item.id.toString() === user?.id
      );
      const u1 = fetchedUsers.filter((item) =>
        currentUser?.friendList.includes(item.id.toString())
      );
      setUserResult(u1);
      setSearchList(u1);
    } catch (error) {
      console.log("Error fetching data from Firestore:" + error);
    }
  };

  const getMessages = async (sUser: User) => {
    try {
      const col = collection(db, "messages");
      const q = query(col, orderBy("timeStamp", "asc"));
      const itemSnapshot = await getDocs(q);
      const messages: Message[] = [];
      itemSnapshot.forEach((doc) => {
        const userData = doc.data();
        messages.push({
          id: doc.id,
          to: userData.to,
          from: userData.from,
          message: userData.message,
          timeStamp: userData.timeStamp,
        });
      });
      const m1 = messages.filter((m) => m.from == user?.id || m.to == user?.id);
      const m2 = m1.filter((m) => m.from == sUser?.id || m.to == sUser?.id);
      setMessageList(m2);
    } catch (error) {
      console.log("Error fetching data from Firestore:" + error);
    }
  };

  const sendMessage = async () => {
    setMessageText("");
    const col = collection(db, "messages");
    await addDoc(col, {
      to: selectedUser?.id,
      from: user?.id,
      message: messageText,
      timeStamp: Timestamp.now(),
    });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setUserImage(user?.imageUrl ?? "");
        fetchUsersFromFirestore();
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (true) {
      setSearchList([]);
      const list: User[] = [];
      userResult.forEach((u) => {
        if (u.name.toLowerCase().includes(searchText.toLowerCase())) {
          list.push(u);
        }
      });
      const updatedList = list.filter((item) => item.id !== user?.id);
      setSearchList(updatedList);
      console.log("Searched Users: ");
      console.log(searchList);
    }
  };

  const formatDate = (timestamp: Timestamp): string => {
    const date = timestamp.toDate();
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true, // Use 12-hour clock
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const handleSendKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && messageText != "") {
      await sendMessage();
      await getMessages(selectedUser!);
    }
  };

  const handleMessageSend = async () => {
    if (messageText != "") {
      await sendMessage();
      await getMessages(selectedUser!);
    }
  };

  const selectUser = async (sUser: User) => {
    setMessageList([]);
    setSelectedUser(sUser);
    await getMessages(sUser);
  };

  return (
    <div className="flex h-[calc(90vh)] m-4 rounded-3xl">
      {/* Left Panel - List of Users */}
      <div className="w-1/4 flex flex-col items-center bg-gray-800 text-white rounded-3xl  p-5">
        <h2 className="text-normal font-semibold mb-6">Messaging</h2>
        <div className="relative rounded-xl w-full mb-10 py-1 bg-slate-900">
          <input
            className="pl-5 pr-4 py-[5px] z-0 w-full bg-transparent rounded-xl  focus:outline-none "
            type="text"
            placeholder="Search User..."
            onKeyDown={handleKeyDown}
            onChange={(value) => {
              setSearchText(value.target.value);
            }}
          />
          <span className="absolute inset-y-0 right-2 z-50 px-3 flex items-center">
            <button onClick={() => {}}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </span>
        </div>
        {/* Example User */}
        {searchList.map((u) => (
          <button
            className="flex w-11/12 flex-row items-center mb-4 pb-4 border border-x-0 border-t-0 border-b-1 border-zinc-700"
            onClick={() => {
              selectUser(u);
            }}
          >
            <Image
              width={100}
              height={100}
              src={u.imageUrl}
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-5"
            />
            <div className="flex flex-col items-start">
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-400">{u.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Right Panel - Current Message Box */}
      <div className="w-3/4 h-[calc(90vh)] bg-gray-900  text-white p-4">
        {selectedUser && (
          <div className="h-[calc(85vh)] flex flex-col justify-between ">
            <div className=" mb-4 h-[calc(75vh)] overflow-auto">
              <p className="font-semibold ml-2">{selectedUser.name}</p>
              {/* <p className="text-sm text-gray-400">Online</p> */}
              {/* Chat Messages */}
              <div className="mt-10">
                {/* Example Message */}
                {messageList.map((m) => {
                  const formattedDate = formatDate(m.timeStamp);
                  return user?.id == m.from ? (
                    <div className="w-[calc(30vw)] ml-auto flex flex-row mb-6 justify-end ">
                      <div className="bg-emerald-600 text-white px-3 py-2 rounded-lg ">
                        <p>{m.message}</p>
                        <p className="text-[11px] mt-1">{formattedDate}</p>
                      </div>
                      <Image
                        width={100}
                        height={100}
                        src={user.imageUrl}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full ml-2"
                      />
                    </div>
                  ) : (
                    <div className="w-[calc(30vw)] mr-auto flex flex-row mb-6 justify-start ">
                      <Image
                        width={100}
                        height={100}
                        src={selectedUser.imageUrl}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div className="bg-gray-800 text-white px-3 py-2 rounded-lg ">
                        <p>{m.message}</p>
                        <p className="text-[11px] mt-1">{formattedDate}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Message Input */}{" "}
            <div className="flex flex-row bg-slate-800 p-2 px-8 rounded-lg ">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-4 py-2 bg-transparent border-none focus:outline-none"
                value={messageText}
                onChange={(value) => {
                  setMessageText(value.target.value);
                }}
                onKeyDown={handleSendKeyDown}
              />
              <button
                onClick={() => {
                  handleMessageSend;
                }}
              >
                <FontAwesomeIcon
                  className="primary-green w-5 h-5"
                  icon={faPaperPlane}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
