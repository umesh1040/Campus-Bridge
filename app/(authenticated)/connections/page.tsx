"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComment,
  faBookmark,
  faEllipsisVertical,
  faShare,
  faImage,
  faPaperPlane,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Users from "./users";
export default function Connections() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div>
      <Users></Users>
    </div>
  );
}
