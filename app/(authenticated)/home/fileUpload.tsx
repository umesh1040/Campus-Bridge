import { useState, ChangeEvent } from "react";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";

const FileUpload: React.FC = () => {
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
  const storage = getStorage(app);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `dot_resources/${file.name}`);
      const metadata = {
        contentType: "application/pdf",
      };
      const uploadTask = uploadBytes(storageRef, file, metadata);
      await uploadTask.then((snapshot) => {
        console.log(snapshot.ref.fullPath);
      });
      setUploading(true);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".pdf" />
      <button onClick={handleUpload}>Upload</button>
      {uploading && <p>Uploading: {uploadProgress}%</p>}
    </div>
  );
};

export default FileUpload;
