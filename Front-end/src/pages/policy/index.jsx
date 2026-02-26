'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Home, Shield } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldDescription,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Privacy() {
  return (
    <div className={cn("min-h-screen bg-black text-white py-20 px-4", geistMono.className)}>
        <Navbar/>
      <div className="max-w-4xl mt-12 mx-auto">
        
        {/* Header Card */}
        <Card className="bg-cyan-950/20 border-cyan-800/30 text-white mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Link href="/" className="inline-block">
                <div className="flex size-12 items-center justify-center rounded-full bg-cyan-950/50 border border-cyan-800/30">
                  <Shield className="text-cyan-400" />
                </div>
              </Link>
            </div>
            <CardTitle className="text-4xl md:text-5xl font-bold mb-4">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Policy</span>
            </CardTitle>
            <CardDescription className="text-white/70 text-lg">
              Last updated: February 27, 2026
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Privacy Policy Content */}
        <Card className="bg-cyan-950/20 border-cyan-800/30 text-white mb-6">
          <CardContent className="pt-6 space-y-6">
            
            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">1. Information I Collect</h2>
              <p className="text-white/70 leading-relaxed">
                I collect personal information such as your name and email address when you create an account. 
                I also store job application data, notes, and status updates that you enter.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">2. Email Access</h2>
              <p className="text-white/70 leading-relaxed">
                If you connect your email account, I request read only access to identify job related messages. 
                I do not delete, send, or modify your emails.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">3. How I Use Your Information</h2>
              <p className="text-white/70 leading-relaxed">
                I use your data to provide job tracking features, detect status updates, generate insights, 
                and improve the platform experience.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">4. Data Storage and Security</h2>
              <p className="text-white/70 leading-relaxed">
                I take reasonable measures to protect your data. Sensitive information such as access tokens 
                is stored securely and handled with restricted access.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">5. Third Party Services</h2>
              <p className="text-white/70 leading-relaxed">
                I use third party services for authentication and integrations, such as Google OAuth. 
                These services have their own privacy policies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">6. Data Sharing</h2>
              <p className="text-white/70 leading-relaxed">
                I do not sell your personal data. I only share information when required by law or to 
                provide essential service functionality.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">7. Data Retention</h2>
              <p className="text-white/70 leading-relaxed">
                I retain your data while your account remains active. You can request account deletion at 
                any time, and your data will be permanently removed from my system.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">8. Your Rights</h2>
              <p className="text-white/70 leading-relaxed">
                You have the right to access, update, or delete your personal information. You can contact me 
                to request changes or removal of your data.
              </p>
            </div>

          </CardContent>
        </Card>

        <FieldDescription className="mt-6 text-center text-white/40 text-sm">
          For privacy-related inquiries, please contact me at{' '}
          <Link 
            href="https://fuadseiddb-portfolio.vercel.app/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
          >
           Contact Me
          </Link>
        </FieldDescription>

      </div>
      <Footer/>
    </div>
  );
}