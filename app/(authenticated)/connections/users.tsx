import {
  collection,
  doc,
  getDocs,
  setDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { initializeApp } from "firebase/app";
import React, { useEffect, useState } from "react";
import { useSession } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface User {
  id: String;
  name: string;
  description: string;
  university: string;
  imageUrl: string;
  friendList: string[];
}

const UserCard: React.FC<{
  user: User;
  currentUser: string;
  friendList: string[];
}> = ({ user, currentUser, friendList }) => {
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
  const connect = async () => {
    try {
      if (currentUser) {
        friendList.push(user.id.toString());
        const docRef = doc(db, "users", currentUser);
        await updateDoc(docRef, {
          friendList: friendList,
        });
        const connectionFriendList = user.friendList;
        connectionFriendList.push(currentUser);
        const connectionDocRef = doc(db, "users", user.id.toString());
        await updateDoc(connectionDocRef, {
          friendList: connectionFriendList,
        });
        window.location.reload();
      } else {
        console.error("Error: currentUser is null or undefined");
      }
    } catch (error) {
      console.error("Error: currentUser is null or undefined");
    }
  };

  return (
    <div className="border border-gray-800 bg-gray-950 text-white rounded-lg shadow-md flex items-center">
      <div className="w-full flex flex-col items-center">
        <div className="w-full py-6 bg-gray-800 mb-4 flex flex-row justify-center">
          <Image
            src={user.imageUrl}
            alt={user.name}
            width={100}
            height={100}
            className="rounded-full w-32"
          />
        </div>
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-sm text-cyan-300">{user.description}</p>
        <p className="text-sm w-4/5 text-center text-zinc-500 mt-3 whitespace-normal overflow-hidden overflow-ellipsis">
          {user.university}
        </p>
        <div className="flex flex-row justify-center mb-6">
          {currentUser == user.id && (
            <div
              className="mt-5  primary-green font-semibold rounded-full px-7 py-[6px] "
              onClick={() => {}}
            >
              You
            </div>
          )}
          {friendList.includes(user.id.toString()) && (
            <div
              className="mt-5  primary-green font-semibold rounded-full px-7 py-[6px] "
              onClick={() => {}}
            >
              Connected
            </div>
          )}
          {currentUser != user.id &&
          !friendList.includes(user.id.toString()) ? (
            <button
              className="mt-5 bg-primary-green primary-green font-semibold rounded-full px-7 py-[6px] border border-green-900"
              onClick={connect}
            >
              Connect
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

const UsersList: React.FC<{ users: User[] }> = ({ users }) => {
  const session = useSession();
  const user = session.session?.user;
  const [currentUser, setCurrentUser] = useState<String>("");
  const [friendList, setFriendList] = useState<string[]>([]);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setCurrentUser(user?.id ?? "1001");
        users.forEach((u) => {
          if (u.id == currentUser) {
            setFriendList(u.friendList);
          }
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [user, friendList, users]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {users.map((u) => (
        <div key={u.id.toString()} className="">
          <UserCard
            user={u}
            currentUser={currentUser.toString()}
            friendList={friendList}
          />
        </div>
      ))}
    </div>
  );
};

export default function Users() {
  const [userResult, setUserResult] = useState<User[]>([]);
  const [userSearchResult, setUserSearchResult] = useState<User[]>([]);
  const [searchText, setSearchText] = useState("");
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
      setUserResult(fetchedUsers);
      setUserSearchResult(fetchedUsers);
      fetchedUsers.forEach((u) => {
        console.log("Users:" + u.friendList);
      });
    } catch (error) {
      console.log("Error fetching data from Firestore:" + error);
    }
  };

  useEffect(() => {
    fetchUsersFromFirestore();
  }, []);

  const filterUserList = (input: string) => {
    setUserSearchResult([]);
    const list: User[] = [];
    userResult.forEach((u) => {
      if (u.name.toLowerCase().includes(input.toLowerCase())) {
        list.push(u);
      }
    });
    setUserSearchResult(list);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValue = (event.target as HTMLInputElement).value;
    console.log(inputValue);
    filterUserList(inputValue);
  };

  return (
    <div className="min-h-screen w-[calc(75vw)] p-8">
      <div className="relative rounded-xl w-2/5 mb-5 py-1 bg-slate-900">
        <input
          className="pl-5 pr-4 py-[10px] z-0 w-full bg-transparent rounded-full border border-zinc-700 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-600"
          type="text"
          placeholder="Search User..."
          onKeyUp={handleKeyDown}
          onChange={(value) => {
            setSearchText(value.target.value);
          }}
        />
        <span className="absolute inset-y-0 right-2 z-50 px-3 flex items-center">
          <button onClick={() => filterUserList(searchText)}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </span>
      </div>
      <h1 className="text-lg primary-green font-semibold mb-5">
        People you may know...
      </h1>
      <UsersList users={userSearchResult} />
    </div>
  );
}
