import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const openMenu = () => setIsOpen(!isOpen);

  return (
    <div className="w-full">
      <div className="md:flex hidden flex-row items-center w-full justify-around p-4 text-white">
        <div>Home</div>
        <div>Jobs</div>
        <div>About</div>
        <div>Contact</div>
      </div>
      
      <div className="md:hidden flex flex-col w-full text-white">
        <div className="flex justify-end p-4">
          <div onClick={openMenu} className="cursor-pointer">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </div>
        </div>
        
        {isOpen && (
          <div className="flex flex-col items-center w-full space-y-4 pb-4">
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