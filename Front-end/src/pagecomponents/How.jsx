import { Button } from "@/components/ui/button";
import {
  Briefcase,
  CalendarClock,
  TrendingUp,
  Sparkles,
  Clock,
  BarChart3,
  Target,
  ArrowRight,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  User,
  StickyNote,
} from "lucide-react";
export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Add Your Applications",
      description:
        "Save job title, company, link, resume version, and notes in one place.",
      details: [
        "Job title",
        "Company name",
        "Application link",
        "Resume used",
        "Personal notes",
      ],
      position: "left",
    },
    {
      number: 2,
      title: "Track & Manage Status",
      description:
        "Move applications across stages like Applied, Interview, Offer, or Rejected. Set follow-up reminders so you never miss interviews or emails.",
      position: "right",
    },
    {
      number: 3,
      title: "Analyze & Improve",
      description:
        "View total applications, interview rate, and offer rate to improve your strategy and land your dream job faster.",
      position: "left",
    },
  ];

  const emptyPanelContent = [
    {
      side: "right",
      step: 1,
      icon: CalendarClock,
      content: "upcoming interviews",
    },
    { side: "left", step: 2, icon: BarChart3, content: "your pipeline" },
    {
      side: "right",
      step: 3,
      icon: TrendingUp,
      content: "insights & analytics",
    },
  ];

  return (
    <div id="how" className="min-h-screen bg-black w-full px-6 py-16">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl font-bold mb-4 text-white">
          How Smart Job Tracker Works
        </h1>
        <p className="text-gray-400 mb-6">
          Track every application. Stay organized. Land interviews faster.
        </p>
        <Button className="px-8 py-6 bg-[var(--buttonbg)] text-white rounded-lg text-lg font-medium hover:bg-[var(--hoverbtnbg)] cursor-pointer transition">
          Start Tracking
        </Button>
      </section>

      {/* Steps with boxes and horizontal connectors */}
      <section className="max-w-5xl mx-auto relative mb-24">
        {/* Background connecting line (subtle) */}
        <div
          className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-30 hidden md:block pointer-events-none"
          style={{ transform: "translateY(-50%)" }}
        />

        {/* Dynamic Steps Generation */}
        {steps.map((step, index) => {
          const isLeft = step.position === "left";
          const isLastStep = index === steps.length - 1;
          const emptyContent = emptyPanelContent.find(
            (item) =>
              item.step === step.number &&
              ((isLeft && item.side === "right") ||
                (!isLeft && item.side === "left")),
          );

          return (
            <div
              key={step.number}
              className="grid grid-cols-2 gap-8 items-center mb-16 relative"
            >
              {/* Left Column - Either Step or Empty Panel */}
              <div
                className={`relative flex ${isLeft ? "justify-end pr-4" : "justify-start pl-4"}`}
              >
                {isLeft ? (
                  // Step on left side
                  <>
                    {/* Connector from previous step (if not first) */}
                    {index > 0 && (
                      <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-12 h-0.5 bg-gradient-to-l from-[#3b82f6] to-transparent z-10 hidden md:block" />
                    )}
                    {/* Connector to next step (if not last) */}
                    {!isLastStep && (
                      <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-0.5 bg-gradient-to-r from-[#3b82f6] to-transparent z-10 hidden md:block" />
                    )}

                    <div className="step-card w-full">
                      <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-full bg-[var(--buttonbg)] flex-shrink-0 flex items-center justify-center text-white font-bold text-xl">
                          {step.number}
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold mb-3 text-white">
                            {step.title}
                          </h2>
                          <p className="text-gray-400 mb-4">
                            {step.description}
                          </p>
                          {step.details && (
                            <ul className="list-disc pl-5 text-gray-400 space-y-2">
                              {step.details.map((detail, i) => (
                                <li key={i}>{detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Empty panel on left side
                  <div className="empty-panel w-full">
                    <span className="flex flex-col p-10 justify-center items-center">
                      {emptyContent?.icon && (
                        <div className="flex justify-center mb-4">
                          <emptyContent.icon className="w-8 h-8 text-cyan-300" />
                        </div>
                      )}
                      {emptyContent?.content || "✨ job search ✨"}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column - Either Empty Panel or Step */}
              <div
                className={`relative flex ${!isLeft ? "justify-start pl-4" : "justify-end pr-4"}`}
              >
                {!isLeft ? (
                  // Step on right side
                  <>
                    {/* Connector from previous step */}
                    <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-12 h-0.5 bg-gradient-to-l from-[#3b82f6] to-transparent z-10 hidden md:block" />
                    {/* Connector to next step (if not last) */}
                    {!isLastStep && (
                      <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-0.5 bg-gradient-to-r from-[#3b82f6] to-transparent z-10 hidden md:block" />
                    )}

                    <div className="step-card w-full">
                      <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-full bg-[var(--buttonbg)] flex-shrink-0 flex items-center justify-center text-white font-bold text-xl">
                          {step.number}
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold mb-3 text-white">
                            {step.title}
                          </h2>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Empty panel on right side
                  <div className="empty-panel w-full">
                    <span>
                      {" "}
                      {emptyContent?.icon && (
                        <div className="flex justify-center mb-4">
                          <emptyContent.icon className="w-8 h-8 text-cyan-300" />
                        </div>
                      )}
                      {emptyContent?.content || "🚀 next steps 🚀"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Start Managing Your Job Search Today
        </h2>
        <Button className="px-8 py-6 bg-[var(--buttonbg)] hover:bg-[var(--hoverbtnbg)] text-white rounded-lg text-lg font-medium hover:brightness-110 transition">
          Create Free Account
        </Button>
      </section>

      {/* Styles */}
      <style jsx>{`
        .step-card {
          background: #0a0a0a;
          border: 1px solid #1f1f1f;
          border-radius: 2rem;
          padding: 2rem;
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(59, 130, 246, 0.1);
          transition: all 0.2s ease;
        }

        .step-card:hover {
          border-color: rgba(59, 130, 246, 0.25);
          box-shadow:
            0 25px 50px -12px rgba(30, 58, 138, 0.2),
            0 0 0 1px #3b82f6;
        }

        .empty-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(2px);
          border-radius: 2rem;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1f2937;
          font-size: 1rem;
          letter-spacing: 0.5px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }

        .empty-panel span {
          background: #0a0a0a;
          padding: 0.5rem 1.5rem;
          border-radius: 9999px;
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.25);
          font-weight: 400;
          font-size: 0.9rem;
          backdrop-filter: blur(10px);
        }

        :root {
          --buttonbg: #3b82f6;
        }
      `}</style>
    </div>
  );
}
