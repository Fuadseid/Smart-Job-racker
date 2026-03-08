'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
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
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Terms() {
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
                  <Home className="text-cyan-400" />
                </div>
              </Link>
            </div>
            <CardTitle className="text-4xl md:text-5xl font-bold mb-4">
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Service</span>
            </CardTitle>
            <CardDescription className="text-white/70 text-lg">
              Last updated: February 27, 2026
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Terms Content */}
        <Card className="bg-cyan-950/20 border-cyan-800/30 text-white mb-6">
          <CardContent className="pt-6 space-y-6">
            
            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">1. Acceptance of Terms</h2>
              <p className="text-white/70 leading-relaxed">
                By creating an account or using Smart Job Tracker, you agree to these Terms of Service. 
                If you do not agree, do not use the platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">2. Description of Service</h2>
              <p className="text-white/70 leading-relaxed">
                Smart Job Tracker allows you to manage and monitor job applications, track status updates, 
                store notes, and view progress statistics. Features may change or improve over time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">3. User Account</h2>
              <p className="text-white/70 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials. 
                You agree to provide accurate information and keep your account details updated.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">4. Acceptable Use</h2>
              <p className="text-white/70 leading-relaxed">
                You agree not to misuse the platform. You must not attempt to access other users' data, 
                disrupt the service, or use the system for unlawful purposes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">5. Email Integration</h2>
              <p className="text-white/70 leading-relaxed">
                If you connect your email account, Smart Job Tracker may access selected emails to detect 
                job related updates. Email access is limited to the permissions you grant. I do not send 
                emails on your behalf without your consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">6. Data Accuracy</h2>
              <p className="text-white/70 leading-relaxed">
                Automatic status detection and analytics depend on available information. You are responsible 
                for reviewing and confirming updates before relying on them.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">7. Account Suspension or Termination</h2>
              <p className="text-white/70 leading-relaxed">
                I reserve the right to suspend or terminate accounts that violate these terms or misuse the service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">8. Limitation of Liability</h2>
              <p className="text-white/70 leading-relaxed">
                Smart Job Tracker is provided "as is". I am not responsible for missed opportunities, 
                incorrect status detection, or any loss resulting from the use of the platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">9. Changes to Terms</h2>
              <p className="text-white/70 leading-relaxed">
                I may update these terms from time to time. Continued use of the service means you accept 
                the updated terms.
              </p>
            </div>

          </CardContent>
        </Card>

        <FieldDescription className="mt-6 text-center text-white/40 text-sm">
          If you have any questions about these Terms, please contact me at{' '}
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