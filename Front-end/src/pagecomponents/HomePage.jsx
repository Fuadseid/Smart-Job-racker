import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function HomePage() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const words = ["Job", "Career"];
  const period = 2000;

  useEffect(() => {
    let timer;

    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText((current) =>
        isDeleting
          ? fullText.substring(0, current.length - 1)
          : fullText.substring(0, current.length + 1),
      );

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), period);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }

      setTypingSpeed(isDeleting ? 100 : 150);
    };

    timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  return (
    <div id="home" className="bg-black min-h-screen">
      <nav className="fixed top-0 w-full z-50">
        <Navbar />
      </nav>

      <main className="flex w-full justify-around flex-row pt-20 px-4 items-center min-h-screen">
        {/* Left side - Text content */}
        <div className="text-white flex flex-col space-y-6 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Track Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">
            Dream
              <span className="text-cyan-300">
                {" "}
                {text}
                <span className="animate-pulse ml-1 text-cyan-300">|</span>
              </span>
            </span>
          </h1>

          <p className="text-gray-400 text-lg">
            Monitor your job applications, interviews, and offers all in one
            place. Never miss an opportunity again.
          </p>

          <div className="flex space-x-4">
            <Link href="/login">
              <Button className="bg-[var(--buttonbg)] cursor-pointer  text-white px-6 py-6 rounded-3xl font-medium hover:bg-[var(--hoverbtnbg)] transition-colors">
                Get Started
              </Button>
            </Link>
            <Button className="border  cursor-pointer  text-white px-6 py-6 rounded-lg font-medium hover:bg-gray-900 transition-colors">
              Learn More
            </Button>
          </div>
        </div>

        {/* Right side - Image with shadow gradients */}
        <div className="relative">
          {/* Gradient background effects */}
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-gray-500 to-gray-300 rounded-full blur-3xl opacity-20"></div>

          {/* Main image container with shadow */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-2xl z-10"></div>

            {/* Image with drop shadow */}
            <Image
              src="/dashbord.jpg"
              width={500}
              height={200}
              alt="Home illustration"
              className="object-contain relative z-0 drop-shadow-2xl"
              priority
            />

            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-gray-400 to-gray-600 rounded-full blur-xl opacity-20"></div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-gray-600/30 to-gray-400/30 rounded-full blur-3xl"></div>
        </div>
      </main>

      {/* Optional bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </div>
  );
}

export default HomePage;
