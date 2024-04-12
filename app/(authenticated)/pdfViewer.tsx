"use client";
import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";

interface PdfViewerProps {
  pdfFileName: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfFileName }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [tempFileURL, setTempFileURL] = useState("");
  const firebaseConfig = {
    apiKey: "AIzaSyBvdsAlLvHfijS2xYnSserphmfPNiwc9q0",
    authDomain: "cb-backend-90a12.firebaseapp.com",
    projectId: "cb-backend-90a12",
    storageBucket: "cb-backend-90a12.appspot.com",
    messagingSenderId: "1001305396798",
    appId: "1:1001305396798:web:1b09bb2a3e8e6f08e5636f",
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  async function fetchPdfUrlFromStorage(
    pdfFileName: string
  ): Promise<string | null> {
    try {
      // const pdfRef = ref(storage, `dot_resources/${pdfFileName}`);
      // const pdfUrl = await getDownloadURL(pdfFileName);
      return pdfUrl;
    } catch (error) {
      console.log("Error fetching PDF from Firebase Storage:" + error);
      return null;
    }
  }

  useEffect(() => {
    fetchPdfUrlFromStorage(pdfFileName).then((url) => {
      setPdfUrl(url);
    });
  }, []);

  return (
    <div className="w-full">
      {pdfFileName ? (
        <iframe
          src={pdfFileName}
          width="100%"
          height="100%"
          className="text-zinc-300 h-screen overflow-auto"
          allowFullScreen
        ></iframe>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default PdfViewer;
