// home.tsx or page.tsx
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import HomePage from "@/pagecomponents/HomePage";
import Dashboard from "@/pagecomponents/Dashboard";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={`${geistMono.className}  bg-black h-screen font-sans w-full`}>
     <HomePage/>
    {/*  <Dashboard/> */}
    </div>
  );
}