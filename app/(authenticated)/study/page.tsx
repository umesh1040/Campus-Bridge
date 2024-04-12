"use client";
import { useEffect, useState } from "react";
import PdfViewer from "../pdfViewer";
import YouTubeEmbed from "./youtube";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

interface Resource {
  id: String;
  branch: string;
  subject: string;
  link: string;
  resourceName: string;
  resourceType: string;
}

export default function Study() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [books, setBooks] = useState<Resource[]>([]);
  const [roadmaps, setRoadmaps] = useState<Resource[]>([]);
  const [videos, setVideos] = useState<Resource[]>([]);
  const [resourceTypes, setResourceTypes] = useState<string[]>([
    "Books",
    "Roadmaps",
    "Videos",
  ]);
  const [selectedResourceType, setSelectedResourceType] =
    useState<string>("Books");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<Resource>();
  const [selectedRoadmap, setSelectedRoadmap] = useState<Resource>();
  const [isBranchOpen, setIsBranchOpen] = useState<boolean>(false);
  const [isBookOpen, setIsBookOpen] = useState<boolean>(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState<boolean>(false);
  const [isSubjectOpen, setIsSubjectOpen] = useState<boolean>(false);
  const toggleBranchDropdown = () => {
    setIsBranchOpen(!isBranchOpen);
  };
  const toggleBookDropdown = () => {
    setIsBookOpen(!isBookOpen);
  };
  const toggleRoadmapDropdown = () => {
    setIsRoadmapOpen(!isRoadmapOpen);
  };
  const toggleSubjectDropdown = () => {
    setIsSubjectOpen(!isSubjectOpen);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    toggleSubjectDropdown();
    setBooks([]);
    setRoadmaps([]);
    setVideos([]);
    const b: Resource[] = [];
    const rs: Resource[] = [];
    const v: Resource[] = [];
    resources.forEach((r) => {
      console.log(r);
      console.log(value);
      console.log(selectedBranch);
      if (value == r.subject && r.branch == selectedBranch) {
        switch (r.resourceType) {
          case "roadmap":
            rs.push(r);
            break;
          case "book":
            b.push(r);
            break;
          case "video":
            v.push(r);
            break;
          default:
            break;
        }
      }
    });
    setBooks(b);
    setRoadmaps(rs);
    setVideos(v);
    setSelectedBook(undefined);
    setSelectedRoadmap(undefined);
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    toggleBranchDropdown();
    const subs: string[] = [];
    resources.forEach((r) => {
      if (value == r.branch) {
        subs.push(r.subject);
      }
    });
    const stringSet = new Set(subs);
    setSubjects(Array.from(stringSet));
    setSelectedSubject("");
  };

  const handleBookChange = (value: Resource) => {
    setSelectedBook(value);
    toggleBookDropdown();
  };

  const handleRoadmapChange = (value: Resource) => {
    setSelectedRoadmap(value);
    toggleRoadmapDropdown();
  };

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

  const fetchResoucesFromFirestore = async () => {
    try {
      const col = collection(db, "resources");
      const itemSnapshot = await getDocs(col);
      const resources: Resource[] = [];
      const subs: string[] = [];
      const branchs: string[] = [];
      itemSnapshot.forEach((doc) => {
        const resource = doc.data();
        subs.push(resource.subject.trim());
        branchs.push(resource.branch.trim());
        resources.push({
          id: doc.id,
          branch: resource.branch,
          subject: resource.subject,
          link: resource.link,
          resourceName: resource.resourceName,
          resourceType: resource.resourceType,
        });
      });
      const stringSet = new Set(subs);
      setSubjects(Array.from(stringSet));
      const stringSet2 = new Set(branchs);
      setBranches(Array.from(stringSet2));
      setResources(resources);
    } catch (error) {
      console.log("Error fetching data from Firestore:" + error);
    }
  };

  useEffect(() => {
    fetchResoucesFromFirestore();
  }, []);

  const [selectedContent, setContent] = useState({
    title: "",
    description: "",
    file: "",
    video: "",
  });
  function handleContentClick(content: any) {
    setContent(content);
  }

  return (
    <div>
      <div className="flex flex-row justify-start">
        <div className="mt-5 mr-16 relative z-10 inline-block text-left w-[calc(15vw)]">
          <div>
            <button
              type="button"
              className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm bg-white px-4 py-2 text-sm font-medium text-gray-700 "
              id="options-menu"
              aria-haspopup="true"
              aria-expanded="true"
              onClick={toggleBranchDropdown}
            >
              <span className="mr-2">
                {selectedBranch ? selectedBranch : "Select Branch"}
              </span>
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {isBranchOpen && (
            <div
              className="w-full origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div className="py-1" role="none">
                {branches.map((branch, index) => (
                  <div
                    key={index}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    role="menuitem"
                    onClick={() => handleBranchChange(branch)}
                  >
                    {branch}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-5 relative z-10 inline-block text-left w-[calc(30vw)]">
          <div>
            <button
              type="button"
              className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm bg-white px-4 py-2 text-sm font-medium text-gray-700 "
              id="options-menu"
              aria-haspopup="true"
              aria-expanded="true"
              onClick={toggleSubjectDropdown}
            >
              <span className="mr-2">
                {selectedSubject ? selectedSubject : "Select Subject"}
              </span>
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {isSubjectOpen && selectedBranch != "" && (
            <div
              className="w-full origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div className="py-1" role="none">
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    role="menuitem"
                    onClick={() => handleSubjectChange(subject)}
                  >
                    {subject}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-[calc(75vw)] h-[2000px] items-center pb-10">
        {/* <div className="w-[calc(20vw)] pr-12">
          <div className="pl-8 text-zinc-500 flex flex-col justify-items-start">
            <h2 className="pt-10 py-3 px-4 text-zinc-200 font-semibold text-sm">
              Subjects
            </h2>
            {subjects2.map((subject) => (
              <div key={subject.title}>
                <button
                  className={`py-2 w-full text-start  px-4 text-sm ${
                    selectedContent.file == subject.file
                      ? "bg-primary-green primary-green font-semibold rounded-lg"
                      : "text-white font-extralight"
                  }`}
                  onClick={() => handleContentClick(subject)}
                >
                  {subject.title}
                </button>
              </div>
            ))}
            <h2 className="pt-10 py-4 px-4 text-zinc-200 font-semibold text-sm">
              Roadmaps
            </h2>
            {roadmaps.map((subject) => (
              <div key={subject.title}>
                <button
                  className={`py-2 w-full text-start  px-4 text-sm ${
                    selectedContent.file == subject.file
                      ? "bg-primary-green primary-green font-semibold rounded-lg"
                      : "text-white font-extralight"
                  }`}
                  onClick={() => handleContentClick(subject)}
                >
                  {subject.title}
                </button>
              </div>
            ))}
          </div>
        </div> */}
        <div className="mt-3 mb-2 w-[calc(75vw)] flex flex-row  justify-evenly items-center pt-[10px] border-b border-zinc-800">
          {resourceTypes.map((type) => (
            <div
              key={type}
              className="flex flex-col justify-center items-center"
            >
              <button
                className={`pb-3 px-4 text-sm ${
                  selectedResourceType == type
                    ? "text-white font-semibold"
                    : "text-white font-extralight"
                }`}
                onClick={() => setSelectedResourceType(type)}
              >
                {type}
              </button>
              <div
                className={`w-full h-[1px]  ${
                  selectedResourceType == type ? "bg-primary-green-dark " : ""
                }`}
              ></div>
            </div>
          ))}
        </div>

        <div className="w-[calc(60vw)] h-[2000px] px-10 ">
          {(() => {
            switch (selectedResourceType) {
              case "Books":
                return (
                  <div>
                    <div className="mb-3 relative inline-block text-left w-[calc(15vw)]">
                      <div>
                        <button
                          type="button"
                          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm bg-white px-4 py-2 text-sm font-medium text-gray-700 "
                          id="options-menu"
                          aria-haspopup="true"
                          aria-expanded="true"
                          onClick={toggleBookDropdown}
                        >
                          <span className="mr-2">
                            {selectedBook
                              ? selectedBook.resourceName
                              : "Select Book"}
                          </span>
                          <svg
                            className="-mr-1 ml-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {isBookOpen && (
                        <div
                          className="w-full origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <div className="py-1" role="none">
                            {books.map((book, index) => (
                              <div
                                key={index}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                role="menuitem"
                                onClick={() => handleBookChange(book)}
                              >
                                {book.resourceName}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <PdfViewer
                        pdfFileName={selectedBook?.link ?? ""}
                      ></PdfViewer>
                    </div>
                  </div>
                );
              case "Roadmaps":
                return (
                  <div>
                    <div className="mb-3 relative inline-block text-left w-[calc(15vw)]">
                      <div>
                        <button
                          type="button"
                          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm bg-white px-4 py-2 text-sm font-medium text-gray-700 "
                          id="options-menu"
                          aria-haspopup="true"
                          aria-expanded="true"
                          onClick={toggleRoadmapDropdown}
                        >
                          <span className="mr-2">
                            {selectedRoadmap
                              ? selectedRoadmap.resourceName
                              : "Select Roadmap"}
                          </span>
                          <svg
                            className="-mr-1 ml-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {isRoadmapOpen && (
                        <div
                          className="w-full origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <div className="py-1" role="none">
                            {roadmaps.map((roadmap, index) => (
                              <div
                                key={index}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                role="menuitem"
                                onClick={() => handleRoadmapChange(roadmap)}
                              >
                                {roadmap.resourceName}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <PdfViewer
                      pdfFileName={selectedRoadmap?.link ?? ""}
                    ></PdfViewer>
                  </div>
                );
              case "Videos":
                return (
                  <div>
                    {videos.map((video) => (
                      <div className="mb-14 mt-10 rounded-xl border border-zinc-200">
                        <YouTubeEmbed embedId={video.link}></YouTubeEmbed>
                      </div>
                    ))}
                  </div>
                );

              default:
                return (
                  <div className="flex justify-center items-center h-96 text-2xl">
                    {/* <h1>Please select branch and subject...</h1> */}
                  </div>
                );
            }
          })()}
          {/* <div>
            <FileUpload />
          </div> */}
          {/* <div className="w-full text-center text-md primary-green pt-8 font-semibold">
            {selectedContent.title}
          </div>
          <div className="text-md text-zinc font-base text-justify pt-5 pb-8">
            {selectedContent.description}
          </div>
          {selectedContent.video != "" && (
            <div className="w-full text-md primary-green pb-4 font-base">
              Video resource
            </div>
          )}
          {selectedContent.video != "" && (
            <YouTubeEmbed embedId={selectedContent.video}></YouTubeEmbed>
          )}
          {selectedContent.video != "" && (
            <div className="w-full text-md primary-green pb-4 font-base">
              Study Material
            </div>
          )}
          <div>
            {selectedContent.file == "" ? (
              <div className="flex justify-center items-center h-96 text-2xl">
                <h1>Please select branch and subject...</h1>
              </div>
            ) : (
              <PdfViewer pdfFileName={selectedContent.file}></PdfViewer>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
