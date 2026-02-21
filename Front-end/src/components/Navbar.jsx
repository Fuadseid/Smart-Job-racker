import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const openMenu = () => setIsOpen(!isOpen);

  return (
    <div className={`w-full`}>
      <div className="md:flex hidden flex-row items-center w-full space-x-16 justify-center p-4 text-white">
        <div>Home</div>
        <div>Jobs</div>
        <div>About</div>
        <div>Contact</div>
      </div>
      
      <div className="md:hidden flex flex-col items-center w-full p-4 text-white">
        <div onClick={openMenu} className="cursor-pointer">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </div>
        
        {isOpen && (
          <div className="flex flex-col items-center w-full space-y-4 mt-4">
            <div>Home</div>
            <div>Jobs</div>
            <div>About</div>
            <div>Contact</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;