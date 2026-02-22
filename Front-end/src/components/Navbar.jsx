// components/Navbar.jsx
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const MENU_ITEMS = [
  { label: "Home", href: "/", id: "home" },
  { label: "How it works", href: "/how-it-works", id: "how" },
  { label: "Job  Track", href: "/smart", id: "smart" },
  { label: "Contact", href: "/contact", id: "contact", isLink: true },
  {
    label: "Get Started",
    href: "/login",
    id: "login", // Changed to match your login ID
    isButton: true,
  },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const openMenu = () => setIsOpen(!isOpen);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Update active section based on scroll position
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = MENU_ITEMS.map((item) => ({
        id: item.id,
        label: item.label,
      }));

      // Find the current section in viewport
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is in viewport (with offset for navbar)
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveItem(section.label);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy);
    handleScrollSpy(); // Initial check

    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  const handleNavigation = (item) => {
    setActiveItem(item.label);
    setIsOpen(false);

    // Smooth scroll to section
    const element = document.getElementById(item.id);
    if (element) {
      const yOffset = -100; // Offset to account for fixed navbar
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    } else {
      console.warn(`Element with id "${item.id}" not found`);
    }
  };

  return (
    <div
      className={`w-full flex fixed top-0 z-50 justify-center transition-all duration-300 ${
        scrolled ? "mt-0 pt-4" : "mt-6"
      }`}
      ref={menuRef}
    >
      {/* Desktop Menu */}
      <div className="md:flex hidden flex-row border border-white/40 rounded-4xl items-center w-2/3 space-x-16 justify-center p-2 text-white backdrop-blur-sm bg-black/20 transition-all duration-300 hover:border-white/60">
        {MENU_ITEMS.map((item) => (
          <div
            key={item.label}
            onClick={() => handleNavigation(item)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && handleNavigation(item)
            }
            className="group relative px-4 py-2 cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${item.label}`}
          >
            <span
              className={`
                relative z-10 transition-all duration-300
                ${
                  activeItem === item.label && !item.isButton 
                    ? "text-cyan-300"
                    : "text-white group-hover:text-cyan-300"
                }
              `}
            >
              {item.isButton ? (
                <Link
                  href={item.href}
                  className="text-white hover:text-cyan-300"
                >
                  <Button className="bg-[var(--buttonbg)] cursor-pointer text-white px-10 py-6 rounded-3xl font-medium hover:bg-[var(--hoverbtnbg)] transition-all duration-300 group">
                    {item.label}
                    <ArrowRight className="inline-block ml-2 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                  </Button>
                </Link>
              ) : !item.isLink ? (
                item.label
              ) : (
                <Link href={item.href}>
                  {item.label}
                </Link>
              )}
            </span>

            {/* Animated underline (only for non-button items) */}
            {!item.isButton && (
              <span
                className={`
                  absolute bottom-0 left-1/2 h-0.5 bg-cyan-300 transform -translate-x-1/2 
                  transition-all duration-300
                  ${activeItem === item.label ? "w-1/2" : "w-0 group-hover:w-1/2"}
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex flex-col items-center w-full px-4 text-white">
        <div
          onClick={openMenu}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openMenu()}
          className={`cursor-pointer p-2 rounded-full transition-all duration-300 ${
            scrolled ? "bg-black/40 backdrop-blur-sm" : ""
          }`}
          role="button"
          tabIndex={0}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center w-full space-y-2 mt-4 bg-black/90 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
            >
              {MENU_ITEMS.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => handleNavigation(item)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    handleNavigation(item)
                  }
                  className={`
                    w-full text-center px-4 py-3 rounded-lg cursor-pointer 
                    transition-all duration-300
                    ${
                      activeItem === item.label
                        ? "text-cyan-300 font-semibold bg-white/10"
                        : "text-white hover:text-cyan-300 hover:bg-white/5"
                    }
                    ${item.isButton ? "mt-2 border border-cyan-500/30" : ""}
                  `}
                  role="button"
                  tabIndex={0}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Navbar;
