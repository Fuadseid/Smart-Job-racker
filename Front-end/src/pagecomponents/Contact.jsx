"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { Facebook, Home, Instagram } from "lucide-react";
import Link from "next/link";
import { Outfit, Geist_Mono } from "next/font/google";
import { useCreateConrtactMutation } from "@/store/apiSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: "200",
  display: "swap",
});

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [createContact, { isLoading, isSuccess, isError }] = useCreateConrtactMutation();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }).unwrap();
      
      // Clear form on success
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Show success toast
      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 48 hours.",
        action: {
          label: "Okay",
          onClick: () => toast.dismiss()
        }
      });
      
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div
        className={`${outfit.className} min-h-screen py-12 px-8`}
        style={{ backgroundColor: "#000000" }}
      >
        <Link href="/">
          <Home className="w-6 h-6 text-white hover:text-cyan-300 transition-colors" />
        </Link>
        <div className="max-w-10xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Contact Info */}
            <div className="space-y-8 font-bold py-18 p-16">
              <div>
                <p className="text-[var(--buttonbg)] text-sm font-semibold tracking-widest uppercase mb-4">
                  {"We're here to help"}
                </p>
                <h1 className="text-5xl font-extrabold text-gray-100 mb-4">
                  Contact Us
                </h1>
                <div className="w-12 h-1 bg-[var(--buttonbg)] mb-6"></div>

                <div className="space-y-4 text-gray-300">
                  <p>
                    Need help? Noticed something off? Or just want to share
                    feedback? We love hearing from mums, families, and anyone
                    using the platform — don't hesitate to get in touch{" "}
                    <Link
                      href="mailto:info@maid-match.com"
                      className="text-[var(--buttonbg)] font-bold hover:text-[var(--buttonbg)]/80 transition-colors"
                    >
                      Drop us a line at info@maid-match.com
                    </Link>
                  </p>
                  <p>we usually reply within 48 hours.</p>
                </div>
              </div>

              <div>
                <p className="text-[var(--buttonbg)] text-sm font-bold tracking-wide uppercase mb-4">
                  SOCIAL NETWORKS
                </p>
                <div className="flex space-x-6">
                  <Link
                    href="#"
                    className="flex items-center space-x-2 text-gray-300 hover:text-[var(--buttonbg)] transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-[var(--buttonbg)]" />
                    <span>Facebook</span>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center space-x-2 text-gray-300 hover:text-[var(--buttonbg)] transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-[var(--buttonbg)]" />
                    <span>Instagram</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="px-8 rounded-lg">
              <div className="flex gap-8 mb-6 flex-col">
                <h2 className="text-2xl font-semibold text-gray-300 mb-2">
                  Send Us A Message
                </h2>
                <div className="h-1 w-14 bg-[var(--buttonbg)]"></div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="name" className="text-gray-300 font-bold">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 border-gray-600 focus:border-[var(--buttonbg)] focus:ring-[var(--buttonbg)] bg-gray-800 text-white"
                    style={{ backgroundColor: "#1a1a1a", borderColor: "#333333" }}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300 font-bold">
                    Your Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 border-gray-600 focus:border-[var(--buttonbg)] focus:ring-[var(--buttonbg)] bg-gray-800 text-white"
                    style={{ backgroundColor: "#1a1a1a", borderColor: "#333333" }}
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-gray-300 font-bold">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-2 border-gray-600 focus:border-[var(--buttonbg)] focus:ring-[var(--buttonbg)] bg-gray-800 text-white"
                    style={{ backgroundColor: "#1a1a1a", borderColor: "#333333" }}
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-300 font-bold">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-2 border-gray-600 focus:border-[var(--buttonbg)] focus:ring-[var(--buttonbg)] bg-gray-800 text-white resize-none"
                    style={{ backgroundColor: "#1a1a1a", borderColor: "#333333" }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--buttonbg)] hover:bg-white cursor-pointer hover:bg-[var(--hoverbtnbg)] hover:border hover:border-[var(--buttonbg)] text-white font-medium py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Submit"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}