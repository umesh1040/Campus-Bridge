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
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface QueryProps {
  loading: boolean;
  question: string;
  result: string[];
  questionData: string;
}

interface QueryAnswer {
  id: string;
  query: string;
  answer: string;
  userImage: string;
  userName: string;
  upvotes: number;
  timeStamp: Timestamp;
}

const SearchQuery: React.FC<QueryProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNewQuestion, setIsNewQuestion] = useState(true);
  const [text, setText] = useState("");
  const [answerList, setAnswerList] = useState<QueryAnswer[]>([]);
  const [userImage, setUserImage] = useState<string>("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [questionEditorState, setQuestionEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const onQuestionEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };
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

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  useEffect(() => {
    console.log("check 1");
    try {
      const parsedContent = JSON.parse(props.questionData);
      const state = convertFromRaw(parsedContent);
      setQuestionEditorState(EditorState.createWithContent(state));
    } catch (err) {
    } finally {
      const fetchUserProfile = async () => {
        try {
          setUserImage(user?.imageUrl ?? "");
          fetchAnswers();
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
    }
  }, [props.result, props.questionData]);

  const handleUpload = async (query: string) => {
    closeModal();
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const rawContent = JSON.stringify(rawContentState);
    if (isNewQuestion) {
      const col = collection(db, "questions");
      await addDoc(col, {
        textQuestion: contentState.getPlainText().substring(0, 50),
        question: rawContent,
        userImage: userImage,
        userName: user?.fullName,
        timeStamp: Timestamp.now(),
      });
      window.location.reload();
    } else {
      const col = collection(db, "queries");
      await addDoc(col, {
        query:
          props.questionData != ""
            ? questionEditorState.getCurrentContent().getPlainText()
            : query,
        answer: rawContent,
        userImage: userImage,
        userName: user?.fullName,
        upvotes: 0,
        timeStamp: Timestamp.now(),
      });
      setEditorState(EditorState.createEmpty());
      fetchAnswers();
    }
  };

  const changeUpvote = async (upvote: number, id: string) => {
    const docRef = doc(db, "queries", id);
    await updateDoc(docRef, {
      upvotes: upvote,
    });
    fetchAnswers();
  };

  const fetchAnswers = async () => {
    try {
      console.log("check 2");
      var plainQuestion;
      try {
        const parsedContent = JSON.parse(props.questionData);
        const state = convertFromRaw(parsedContent);
        plainQuestion = EditorState.createWithContent(state)
          .getCurrentContent()
          .getPlainText();
      } catch (error) {}
      console.log(
        " :::::::::::::::::: Check ::::::::::::::::" + props.questionData
      );
      console.log(" :::::::::::::::::: Check ::::::::::::::::" + plainQuestion);
      const col = collection(db, "queries");
      const q = query(
        col,
        orderBy("timeStamp", "desc"),
        where(
          "query",
          "==",
          props.questionData != "" ? plainQuestion : props.result[0]
        )
      );
      const itemSnapshot = await getDocs(q);
      const answers: QueryAnswer[] = [];
      itemSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data);
        answers.push({
          id: doc.id,
          query: data.query,
          answer: data.answer,
          userImage: data.userImage,
          userName: data.userName,
          upvotes: data.upvotes,
          timeStamp: data.timeStamp,
        });
      });
      console.log(" :::::::::::::::::: Check 3 ::::::::::::::::");
      setAnswerList(answers);
    } catch (error) {
      console.log("Error fetching data from Firestore:" + error);
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

  return (
    <div className="w-[calc(75vw)] p-5 flex flex-row gap-5 justify-evenly">
      {props.loading ? (
        <div className="flex flex-col justify-start mt-10">
          <div className="w-[calc(50vw)] h-6 mb-6">
            <Shimmer />
          </div>
          <div className="w-[calc(40vw)] h-6 mb-6">
            <Shimmer />
          </div>
          <div className="w-[calc(25vw)] h-6 mb-6">
            <Shimmer />
          </div>
          <div className="w-[calc(35vw)] h-6 mb-6">
            <Shimmer />
          </div>{" "}
          <div className="w-[calc(50vw)] h-6 mb-6">
            <Shimmer />
          </div>
          <div className="w-[calc(40vw)] h-6 mb-6">
            <Shimmer />
          </div>
          <div className="w-[calc(25vw)] h-6 mb-6">
            <Shimmer />
          </div>
          <div className="w-[calc(35vw)] h-6 mb-6">
            <Shimmer />
          </div>
        </div>
      ) : (
        <div className="w-[calc(75vw)] flex flex-row justify-evenly">
          <div className="w-[calc(45vw)]">
            <div className="flex flex-row justify-start mb-2">
              {props.result.length > 0 && (
                <p className="primary-green font-medium mb-5 text-lg">
                  {props.question}
                </p>
              )}
            </div>
            {props.questionData != "" ? (
              <div className="w-[calc(45vw)] text-zinc text-[16px] line-height-2 leading-10 whitespace-pre-wrap bg-black shadow-2xl rounded-lg px-12 py-4  items-center  mb-8">
                <Editor
                  editorState={questionEditorState}
                  toolbarHidden
                  readOnly
                  editorClassName="text-white"
                />
              </div>
            ) : (
              props.result.map((data) => (
                <div
                  key={data}
                  className="w-[calc(45vw)] bg-black shadow-2xl rounded-lg px-12 py-4 flex flex-row items-center gap-5 mb-8"
                >
                  <div className="text-zinc text-[16px] line-height-2 leading-10 rounded-full whitespace-pre-wrap">
                    <div className="text-blue-400 font-semibold text-lg mb-3">
                      AI generated answer
                    </div>
                    {data}
                  </div>
                </div>
              ))
            )}
            {isOpen && (
              <div className="fixed inset-0 z-20 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-gray-800 py-6 px-10 flex flex-col items-center rounded-lg w-[750px]">
                  <div className="w-full pr-3 flex flex-row items-center justify-end mb-4">
                    <button
                      className="primary-green font-base border-green-900"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    customStyleMap={{
                      HIGHLIGHT: {
                        backgroundColor: "#ffffff",
                      },
                    }}
                    toolbar={{
                      colorPicker: {
                        defaultColor: "#000000",
                      },
                    }}
                    wrapperClassName="border border-gray-300 rounded h-[400px]"
                    editorClassName="p-4 bg-white text-slate-950 rounded-b "
                  />
                  <div className="flex flex-row justify-center mt-20 mb-2">
                    <button
                      className="mt-5 bg-primary-green primary-green font-semibold rounded-full px-7 py-[6px] border border-green-900"
                      onClick={() => handleUpload(props.result[0])}
                    >
                      {isNewQuestion ? "Post Question" : "Post Answer"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-row justify-between mb-5">
              <div className="text-white text-xl font-semibold mb-5">
                {answerList.length} Answers
              </div>
              <div className="flex flex-row justify-end">
                <button
                  className="rounded-md bg-blue-800 h-9 text-sm px-4"
                  onClick={() => {
                    setIsNewQuestion(false);
                    openModal();
                  }}
                >
                  Post Answer
                </button>
              </div>
            </div>
            {answerList.map((answer) => {
              const parsedContent = JSON.parse(answer.answer);
              const contentState = convertFromRaw(parsedContent);
              const formattedDate = formatDate(answer.timeStamp);
              return (
                <div
                  key={answer.id}
                  className="w-[calc(45vw)] bg-white shadow-2xl rounded-lg px-12 py-4 flex flex-row items-center gap-5 mb-8"
                >
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col justify-start items-center mr-8  mt-14">
                      <button
                        onClick={() =>
                          changeUpvote(++answer.upvotes, answer.id)
                        }
                        className="p-3 border rounded-full text-slate-700 border-slate-700"
                      >
                        <FontAwesomeIcon className="w-5 h-5" icon={faArrowUp} />
                      </button>
                      <div>
                        <div className="text-slate-700 text-xl font-semibold my-5 ">
                          {answer.upvotes}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          changeUpvote(--answer.upvotes, answer.id)
                        }
                        className="p-3 border rounded-full text-slate-700 border-slate-700"
                      >
                        <FontAwesomeIcon
                          className="w-5 h-5"
                          icon={faArrowDown}
                        />
                      </button>
                    </div>
                    <div>
                      <div className="text-zinc text-[16px] leading-10 rounded-full">
                        <Editor
                          editorState={EditorState.createWithContent(
                            contentState
                          )}
                          toolbarHidden
                          readOnly
                          editorClassName="bg-white text-slate-950 break-all"
                        />
                      </div>
                      <div className="flex flex-row justify-end mt-4">
                        <div className=" mb-5 flex flex-col items-start px-5 text-white text-xl py-3 bg-slate-800 rounded-xl ">
                          <div className="text-xs text-white mb-1">
                            Answered on {formattedDate}
                          </div>
                          <div className="text-zinc-300 text-sm font-semibold flex flex-row">
                            <Image
                              width={100}
                              height={100}
                              src={answer.userImage}
                              alt="User Avatar"
                              className="w-8 h-8 rounded-full mr-3"
                            />
                            {answer.userName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col mt-14 items-center">
            <div className="flex flex-row justify-end">
              <button
                className="rounded-md bg-blue-800 h-9 text-sm px-4"
                onClick={() => {
                  setIsNewQuestion(true);
                  openModal();
                }}
              >
                Ask Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchQuery;
