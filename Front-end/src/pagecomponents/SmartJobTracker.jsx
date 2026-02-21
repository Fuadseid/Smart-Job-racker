'use client';

import { Briefcase, Clock, FileText, BarChart3, CheckCircle2, Zap } from 'lucide-react';

export default function SmartJobTracker() {
  const features = [
    {
      icon: Briefcase,
      title: 'Store Applications',
      description: 'Keep every job application organized in one structured dashboard.',
    },
    {
      icon: Clock,
      title: 'Track Progress',
      description: 'Move jobs through stages: Applied, Screening, Interview, Offer, Rejected.',
    },
    {
      icon: FileText,
      title: 'Save Interview Notes',
      description: 'Document your interactions and interview feedback for each application.',
    },
    {
      icon: BarChart3,
      title: 'Measure Performance',
      description: 'Analyze conversion rates and improve your job search strategy.',
    },
  ];

  const benefits = [
    'Stay organized',
    'Follow up on time',
    'See patterns',
    'Increase success rate',
  ];

  return (
    <div id='smart' className="min-h-screen bg-black text-white">
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left side - Feature cards grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-900 bg-gray-950 p-6 transition-colors hover:border-cyan-900/50"
                  >
                    <div className="mb-4 inline-block rounded-lg bg-cyan-950 p-3">
                      <Icon className="h-6 w-6 text-cyan-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right side - Value proposition */}
            <div className="flex flex-col justify-center">
              <div className="mb-8">
                <h2 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl">
                  Manage your job search{' '}
                  <span className="italic text-cyan-400">without the chaos</span>
                </h2>
                <p className="text-lg text-gray-400">
                  Most job seekers apply randomly and lose track. Smart Job Tracker turns your job search into a structured system. Store every application, track hiring stages, set reminders, and analyze your performance—all in one place.
                </p>
              </div>

              {/* Benefits grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                    <span className="font-medium text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
