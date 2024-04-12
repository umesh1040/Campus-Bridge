"use client";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { useSession } from "@clerk/nextjs";
import React, { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMessage,
  faHome,
  faUserGroup,
  faGraduationCap,
  faQuestion,
  faQuestionCircle,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import Study from "../study/page";
import Posts from "../posts/page";
import Connections from "../connections/page";
import MessagesPage from "../messages/page";
import SearchQuery from "../query/page";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import ProfilePage from "../profile/page";
import QuestionsPage from "../questions/page";

export default function Home() {
  const firebaseConfig = {
    apiKey: "AIzaSyBvdsAlLvHfijS2xYnSserphmfPNiwc9q0",
    authDomain: "cb-backend-90a12.firebaseapp.com",
    projectId: "cb-backend-90a12",
    storageBucket: "cb-backend-90a12.appspot.com",
    messagingSenderId: "1001305396798",
    appId: "1:1001305396798:web:1b09bb2a3e8e6f08e5636f",
  };
  const session = useSession();
  const user = session.session?.user;

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [items, setItems] = useState<any[]>([]);
  const [queryResult, setQueryResult] = useState<string[]>([]);
  const [page, setPage] = useState("home");
  const [searchText, setSearchText] = useState("");
  const [userImage, setUserImage] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [isQueryLoading, changeLoadingStatus] = useState(false);
  const isFirstRender = useRef(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleProfileCLick = () => {
    setAnchorEl(null);
    changePage("profile");
  };
  const changePage = (page: string) => {
    setPage(page);
    changeLoadingStatus(false);
  };
  const setUser = async () => {
    try {
      const docRef = doc(db, "users", user?.id ?? "1001");
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          designation: "Student",
          name: user?.fullName,
          profile_image: userImage,
          university: "Department Of Technology, Shivaji University Kolhapur",
          friendList: [],
        });
      } else {
        console.log("Document already exists:");
      }
    } catch (error) {
      console.error("Error setting user data:", error);
    }
  };
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const fetchUserProfile = async () => {
      try {
        setUserImage(user?.imageUrl ?? "");
        setUser();
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  });

  const searchQuery = async () => {
    setQuestion("");
    try {
      const response = await fetch(
        `http://localhost:5000/getData/${searchText}`
      );
      const result = await response.json();
      setQueryResult([result]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      changeLoadingStatus(false);
    }
  };

  const handleQueriesCallback = (question: string) => {
    setQuestion(question);
    changePage("query");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      changePage("query");
      changeLoadingStatus(true);
      console.log("Searching...");
      searchQuery();
    }
  };

  return (
    <div className="w-screen text-zinc-300 overflow-y-auto bg-backgound-dark flex flex-col justify-center items-center">
      <div className="overflow-y-auto h-screen">
        {/* ------------------------------ Navbar Started -------------------------- */}
        <div className="w-[calc(75vw)] flex flex-row justify-between  items-center p-[14px] border-b border-zinc-800">
          <div className="text-md text-white font-semibold">
            The Campus Bridge
          </div>
          {/* <Link href="/auth/profile">
          <div className="text-zinc-300 text-lg px-20 py-5">Profile</div>
        </Link> */}
          <button
            className={`flex flex-row gap-2 text-sm ${
              page == "home"
                ? "bg-primary-green primary-green font-semibold rounded-full px-4 py-[6px] border border-green-900"
                : "text-white"
            }`}
            onClick={() => {
              changePage("home");
            }}
          >
            <div>
              <FontAwesomeIcon className="w-4 h-4" icon={faHome} />
            </div>
            Home
          </button>

          <button
            className={`flex flex-row gap-1 text-sm ${
              page == "questions"
                ? "bg-primary-green primary-green font-semibold rounded-full px-4 py-[6px] border border-green-900"
                : "text-white"
            }`}
            onClick={() => {
              changePage("questions");
            }}
          >
            <div>
              <FontAwesomeIcon className="w-5 h-5" icon={faCircleQuestion} />
            </div>
            Queries
          </button>

          <div className="relative w-[calc(30vw)]">
            <input
              className="pl-10 pr-4 py-[5px] z-0 w-full bg-transparent rounded-md border border-zinc-700 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-600"
              type="text"
              placeholder="Search"
              onKeyDown={handleKeyDown}
              onChange={(value) => {
                setSearchText(value.target.value);
              }}
            />
            <span className="absolute inset-y-0 right-2 z-50 px-3 flex items-center">
              <button
                onClick={() => {
                  changePage("query");
                  changeLoadingStatus(true);
                  console.log("Searching...");
                  searchQuery();
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </span>
          </div>
          <div className="flex flex-row gap-20 items-center">
            <div>
              <button onClick={() => changePage("connections")}>
                <FontAwesomeIcon
                  className={`w-5 h-5 ${
                    page == "connections"
                      ? "bg-primary-green primary-green font-semibold rounded-full px-4 py-[6px] border border-green-900"
                      : "text-white"
                  }`}
                  icon={faUserGroup}
                />
              </button>
            </div>
            <div>
              <button onClick={() => changePage("messages")}>
                <FontAwesomeIcon
                  className={`w-5 h-5 ${
                    page == "messages"
                      ? "bg-primary-green primary-green font-semibold rounded-full px-4 py-[6px] border border-green-900"
                      : "text-white"
                  }`}
                  icon={faMessage}
                />
              </button>
            </div>
            <div>
              <button onClick={() => changePage("study")}>
                <FontAwesomeIcon
                  className={`w-6 h-6 ${
                    page == "study"
                      ? "bg-primary-green primary-green font-semibold rounded-full px-4 py-[6px] border border-green-900"
                      : "text-white"
                  }`}
                  icon={faGraduationCap}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-row gap-16 justify-center items-center">
            <Button onClick={handleClick}>
              <UserButton />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfileCLick}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>
                <SignOutButton />
              </MenuItem>
            </Menu>
          </div>
        </div>
        {/* ---------------------------------- Navbar Ended -------------------------- */}
        {(() => {
          switch (page) {
            case "home":
              return <Posts></Posts>;
            case "connections":
              return <Connections></Connections>;
            case "questions":
              return (
                <QuestionsPage callback={handleQueriesCallback}></QuestionsPage>
              );
            case "study":
              return <Study></Study>;
            case "messages":
              return <MessagesPage></MessagesPage>;
            case "query":
              return (
                <SearchQuery
                  loading={isQueryLoading}
                  questionData={question}
                  question={searchText}
                  result={queryResult}
                ></SearchQuery>
              );
            case "profile":
              return <ProfilePage></ProfilePage>;
            default:
              return <Posts></Posts>;
          }
        })()}
      </div>
    </div>
  );
}
