import { Card } from "./components/card";
import Link from "next/link";
import Temp from "./components/temp";
import "./util/constants";
import Landing from "./(landing)/landing_page";

export default function Home() {
  return (
    <main className="font-sans overflow-hidden">
      <Landing></Landing>
    </main>
  );
}
