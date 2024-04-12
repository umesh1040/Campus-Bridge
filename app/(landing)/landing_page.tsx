"use client";
import { useState } from "react";
import CTAButton from "../components/cta_button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const Landing: React.FC = () => {
  let currentButton = "first";
  const [bgColor, setBgColor] = useState<string>("bg-emerald-500");
  const handleButtonHover = (colorClass: string) => {
    setBgColor(colorClass);
  };
  const buttons = [
    {
      title: "Sign In",
      message: "Unlock Limitless Learning",
      buttonText: "SignIn",
      link: "/auth/signin",
      color: "bg-red-500",
      onHover: "hover:bg-red-500",
      handleButtonHover: handleButtonHover,
    },
    {
      title: "Know More",
      message: "Ignite Your Curiosity",
      buttonText: "Know More",
      link: "/auth/signin",
      color: "bg-blue-500",
      onHover: "hover:bg-blue-500",
      handleButtonHover: handleButtonHover,
    },
    {
      title: "Sign Up",
      message: "Embark on Your Journey",
      buttonText: "SignUp",
      link: "/auth/signup",
      color: "bg-purple-500",
      onHover: "hover:bg-purple-500",
      handleButtonHover: handleButtonHover,
    },
  ];

  return (
    <div className="bg-slate-950 min-w-screen h-screen flex flex-col justify-start items-center relative">
      <div className="w-screen flex flex-row  py-5 justify-around">
        <div className="text-lg px-20 primary-green">The Campus Bridge</div>
        {/* <Link href="/auth/profile">
          <div className="text-zinc-300 text-lg px-20 py-5">Profile</div>
        </Link> */}
        <UserButton />
      </div>
      <div
        className={`absolute left-1/2 top-1/2 z-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[200px]  ${bgColor} flex justify-center items-center`}
      ></div>
      <div className="pt-24 text-8xl text-zinc-300 flex flex-col items-center z-100">
        <div className="text-9xl font-extralight flex flex-row">
          Join the
          <div className="primary-green">&nbsp;new</div>
        </div>
        <div className="pt-10 font-extrabold text-9xl">Era of learning</div>
      </div>
      <div className="pt-20 flex flex-row gap-1 goup">
        {buttons.map((button) => (
          <CTAButton key={button.buttonText} {...button}></CTAButton>
        ))}
      </div>
    </div>
  );
};
export default Landing;
