// ProfilePage.tsx
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "@clerk/nextjs";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
const ProfilePage: React.FC = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBvdsAlLvHfijS2xYnSserphmfPNiwc9q0",
    authDomain: "cb-backend-90a12.firebaseapp.com",
    projectId: "cb-backend-90a12",
    storageBucket: "cb-backend-90a12.appspot.com",
    messagingSenderId: "1001305396798",
    appId: "1:1001305396798:web:1b09bb2a3e8e6f08e5636f",
  };
  const isFirstRender = useRef(true);
  const session = useSession();
  const clerkUser = session.session?.user;
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [user, setUser] = useState({
    id: "",
    profilePicture: "",
    fullName: "",
    description: "",
    university: "",
  });

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUser({ ...user, description: event.target.value });
  };

  const handleUniversityChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUser({ ...user, university: event.target.value });
  };

  const fetchUserProfile = async () => {
    try {
      const docRef = doc(db, "users", clerkUser?.id ?? "1001");
      const docSnap = await getDoc(docRef);
      const userData = docSnap.data();
      setUser({
        ...user,
        id: docSnap.id,
        fullName: userData?.name,
        profilePicture: userData?.profile_image,
        description: userData?.designation,
        university: userData?.university,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    } else {
      fetchUserProfile();
    }
  }, [clerkUser]);

  const updateUserProfile = async () => {
    const docRef = doc(db, "users", user.id);
    await updateDoc(docRef, {
      designation: user.description,
      university: user.university,
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col text-white items-center justify-start pt-16">
      <Image
        src={user.profilePicture}
        alt="Profile Picture"
        width={120}
        height={120}
        className="rounded-full"
      />
      <h2 className="text-[25px] font-semibold my-12">{user.fullName}</h2>
      <div className="w-2/5 text-start">
        <div className="text-[19px] font-semibold mb-8">Customize profile</div>
        <div className="text-[13px] tracking-wider text-gray-500 font-semibold mb-5 pb-2 border-b-[1px] border-gray-500">
          PROFILE INFORMATION
        </div>
        <div className="text-[14px] tracking-wide font-semibold mt-4">
          Title(Describe Yourself)
        </div>
        <textarea
          value={user.description}
          onChange={handleDescriptionChange}
          className="mt-3 px-4 py-3 w-full rounded-md bg-slate-950 outline-none "
          rows={2}
          placeholder="Describe yourself..."
        />
        <div className="text-[14px] tracking-wide font-semibold mt-4">
          University Name
        </div>
        <textarea
          value={user.university}
          onChange={handleUniversityChange}
          rows={2}
          className="mt-3 px-4 py-3 w-full rounded-md bg-slate-950 outline-none "
          placeholder="Enter University Name..."
        />
      </div>
      <div className="flex flex-row justify-center mt-8">
        <button
          className="mt-5 bg-primary-green primary-green font-semibold rounded-full px-7 py-[6px] border border-green-900"
          onClick={updateUserProfile}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
