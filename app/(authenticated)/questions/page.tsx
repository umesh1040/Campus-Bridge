import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import Shimmer from "@/app/shimmer";
import { useEffect, useState } from "react";
import { useSession } from "@clerk/nextjs";
import Image from "next/image";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
interface Question {
  id: string;
  question: string;
  userImage: string;
  userName: string;
  textQuestion: string;
  timeStamp: Timestamp;
}
interface MyComponentProps {
  callback: Function;
}

const QuestionsPage: React.FC<MyComponentProps> = ({ callback }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [selectedQueryType, setSelectedQueryType] = useState<string>("all");
  const session = useSession();
  const user = session.session?.user;
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

  const fetchQuestions = async () => {
    try {
      const col = collection(db, "questions");
      const q = query(col, orderBy("timeStamp", "desc"));
      const itemSnapshot = await getDocs(q);
      const questionList: Question[] = [];
      itemSnapshot.forEach((doc) => {
        const data = doc.data();
        questionList.push({
          id: doc.id,
          question: data.question,
          userImage: data.userImage,
          userName: data.userName,
          textQuestion: data.textQuestion,
          timeStamp: data.timeStamp,
        });
      });
      setQuestions(questionList);
      setSelectedQuestions(questionList);
    } catch (error) {
      console.log("Error fetching data from Firestore:" + error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        fetchQuestions();
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

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
  function handleQueryType(queryType: string) {
    if (queryType == "all") {
      setSelectedQuestions(questions);
    } else {
      setSelectedQuestions(
        questions.filter((q) => q.userName == user?.fullName)
      );
    }
    setSelectedQueryType(queryType);
  }

  return (
    <div className="w-[calc(75vw)] p-5 flex flex-col overflow-y-auto items-center gap-5 justify-evenly">
      <div className="mb-3 flex flex-row  justify-center items-center pt-[10px] ">
        <div className="flex flex-col justify-center items-center">
          <button
            className={`pb-2 px-4 text-sm ${
              selectedQueryType == "all"
                ? "text-white font-semibold"
                : "text-white font-normal"
            }`}
            onClick={() => handleQueryType("all")}
          >
            All Queries
          </button>
          <div
            className={`w-full h-[1px]  ${
              selectedQueryType == "all"
                ? "bg-primary-green-dark "
                : "bg-zinc-700"
            }`}
          ></div>
        </div>
        <div className="ml-16 flex flex-col justify-center items-center">
          <button
            className={`pb-2 px-4 text-sm ${
              selectedQueryType == "my"
                ? "text-white font-semibold"
                : "text-white font-normal"
            }`}
            onClick={() => handleQueryType("my")}
          >
            My Queries
          </button>
          <div
            className={`w-full h-[1px]  ${
              selectedQueryType == "my"
                ? "bg-primary-green-dark "
                : "bg-zinc-700"
            }`}
          ></div>
        </div>
      </div>
      {selectedQuestions.map((question) => {
        const parsedContent = JSON.parse(question.question);
        const contentState = convertFromRaw(parsedContent);
        const formattedDate = formatDate(question.timeStamp);
        return (
          <div
            onClick={() => {
              callback(question.question);
            }}
            key={question.id}
            className="w-[calc(45vw)] bg-white shadow-2xl rounded-lg px-5 py-2 flex flex-col items-start mb-3"
          >
            <div className="w-full flex flex-row justify-between items-center text-zinc text-[16px] leading-10 rounded-full">
              <Editor
                editorState={EditorState.createWithContent(contentState)}
                toolbarHidden
                readOnly
                editorClassName="bg-white text-slate-950"
              />
              {selectedQueryType == "all" ? (
                <button
                  className=" bg-blue-800 rounded-full h-9 text-sm px-4 ml-5"
                  onClick={() => {
                    callback(question.question);
                  }}
                >
                  Answer
                </button>
              ) : (
                <div></div>
              )}
            </div>
            <div className="w-full flex flex-row justify-end">
              <div className=" flex flex-col items-start px-5 text-white text-xl py-3 bg-slate-800 rounded-xl ">
                <div className="text-xs text-white mb-1">
                  questioned on {formattedDate}
                </div>
                <div className="text-zinc-300 text-sm font-semibold flex flex-row">
                  <Image
                    width={100}
                    height={100}
                    src={question.userImage}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  {question.userName}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionsPage;
