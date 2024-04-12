"use client";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

export default function Temp() {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  let maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      onMouseMove={onMouseMove}
      className="text-white bg-black text-center z-10 rounded-xl border border-zinc-400/50 m-8 h-60"
    >
      <motion.div
        className="absolute inset-0 z-10  bg-gradient-to-br opacity-100  via-zinc-100/10  transition duration-1000 group-hover:opacity-50 "
        style={style}
      ></motion.div>
      <motion.div
        className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
        style={style}
      >
        <h1 className="mb-4">Portfolio</h1>
        <h3>See the projects</h3>
      </motion.div>
    </div>
  );
}
