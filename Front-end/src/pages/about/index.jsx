'use client';

import { 
  Briefcase, 
  Clock, 
  FileText, 
  BarChart3, 
  CheckCircle2, 
  Target,
  TrendingUp,
  Chrome,
  Sparkles,
  ArrowRight,
  Home
} from 'lucide-react';
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useSelector } from 'react-redux';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function About() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: Briefcase,
      title: 'Track Applications',
      description: 'Save job details, company name, role, and salary. Monitor status from Applied to Interview to Offer.',
    },
    {
      icon: Clock,
      title: 'Status Updates',
      description: 'Update job status manually or detect changes from email integration. Keep full activity history for every job.',
    },
    {
      icon: BarChart3,
      title: 'Smart Insights',
      description: 'View statistics of applications sent, interviews scheduled, and offers received. Improve your job search strategy.',
    },
    {
      icon: Chrome,
      title: 'Chrome Extension',
      description: 'Save jobs directly from LinkedIn and detect interview emails without switching tabs.',
    },
  ];

  const benefits = [
    'Stop using spreadsheets',
    'Track every application',
    'Monitor progress easily',
    'Reduce job search stress',
  ];

  // Show a skeleton loader until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar/>
        <section className="px-6 py-20 md:py-32">
          <div className="mx-auto max-w-4xl">
            {/* Title skeleton */}
            <div className="h-16 w-96 bg-gray-800 animate-pulse mb-6 rounded"></div>
            
            {/* Description skeleton */}
            <div className="h-24 w-full bg-gray-800 animate-pulse mb-10 rounded"></div>
            
            {/* Features grid skeleton */}
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-900 bg-gray-950 p-6"
                >
                  <div className="mb-4 h-12 w-12 rounded-lg bg-gray-800 animate-pulse"></div>
                  <div className="h-6 w-40 bg-gray-800 animate-pulse mb-2 rounded"></div>
                  <div className="h-16 w-full bg-gray-800 animate-pulse rounded"></div>
                </div>
              ))}
            </div>

            {/* CTA skeleton */}
            <div className="mt-16 text-center">
              <div className="h-8 w-64 bg-gray-800 animate-pulse mx-auto mb-4 rounded"></div>
              <div className="h-6 w-96 bg-gray-800 animate-pulse mx-auto mb-6 rounded"></div>
              <div className="h-14 w-48 bg-gray-800 animate-pulse mx-auto rounded-lg"></div>
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-black text-white", geistMono.className)}>
      <Navbar/>
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl">
          
          {/* Header Card */}
          <Card className="bg-cyan-950/20 border-cyan-800/30 text-white mb-10">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Link href="/" className="inline-block">
                  <div className="flex size-12 items-center justify-center rounded-full bg-cyan-950/50 border border-cyan-800/30">
                    <Home className="text-cyan-400" />
                  </div>
                </Link>
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold">
                About{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Smart Job Tracker
                </span>
              </CardTitle>
              <CardDescription className="text-white/70 text-lg mt-4">
                Smart Job Tracker helps you manage every job application in one place. 
                Stop using spreadsheets and start tracking your progress with clarity and confidence.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Mission Card */}
          <Card className="bg-cyan-950/20 border-cyan-800/30 text-white mb-10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-cyan-950/50 border border-cyan-800/30">
                  <Target className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">My Mission</h2>
                  <p className="text-white/70 text-lg">
                    To transform the chaotic job search process into a structured, 
                    manageable, and successful journey for every job seeker.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="bg-cyan-950/20 border-cyan-800/30 text-white hover:border-cyan-700/50 transition-all duration-300"
                >
                  <CardContent className="pt-6">
                    <div className="mb-4 inline-block rounded-lg bg-cyan-950/50 p-3 border border-cyan-800/30">
                      <Icon className="h-6 w-6 text-cyan-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Benefits Card */}
          <Card className="bg-cyan-950/20 border-cyan-800/30 text-white mt-10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Why Choose Smart Job Tracker?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <Field key={index}>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-950/10 border border-cyan-800/20">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                      <span className="text-white/80">{benefit}</span>
                    </div>
                  </Field>
                ))}
              </FieldGroup>
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="bg-cyan-950/20 border-cyan-800/30 text-white mt-10">
            <CardContent className="pt-6 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Take Control of Your Job Search
              </h2>
              <p className="text-white/70 mb-8 text-lg">
                Organize applications, reduce stress, and stay focused on results.
              </p>
              <Link href={isAuthenticated?'/dashboard':'signup'}>
                <Button className="px-8 py-6 cursor-pointer bg-[var(--buttonbg)] hover:bg-[var(--hoverbtnbg)] text-white rounded-lg text-lg font-medium hover:brightness-110 transition inline-flex items-center gap-2 group">
                  Start Tracking Today
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <FieldDescription className="mt-8 text-center text-white/60 text-sm">
            By using Smart Job Tracker, you agree to my{" "}
            <Link href="/terms" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </FieldDescription>

          {/* Contact Info */}
          <FieldDescription className="mt-4 text-center text-white/40 text-sm">
            Created by{' '}
            <Link 
              href="https://fuadseiddb-portfolio.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
            >
              Fuad Seid
            </Link>
          </FieldDescription>

        </div>
      </section>
      <Footer/>
    </div>
  );
}