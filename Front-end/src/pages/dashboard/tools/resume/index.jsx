// pages/dashboard/resume-analyzer.jsx
import Dashboard from "@/pagecomponents/Dashboard";
import { useUploadResumeMutation } from "@/store/apiSlice";
import { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye,
  ChevronRight,
  Star,
  TrendingUp,
  Calendar,
  Building,
  ExternalLink,
  RefreshCw,
  Save,
  Share2,
  Printer,
  PieChart,
  BarChart,
  Target,
  Zap,
  BookOpen,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function ResumeAnalyzer() {
  const [uploadResume, { isLoading }] = useUploadResumeMutation();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setResult(null);
      toast.success("File selected successfully!");
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setFilePreview(URL.createObjectURL(droppedFile));
      setResult(null);
      toast.success("File dropped successfully!");
    } else {
      toast.error("Please drop a valid PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await uploadResume(formData).unwrap();
      setResult(response);
      toast.success("Resume analyzed successfully!");
      setActiveTab("overview");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.data?.error || "Failed to analyze resume");
    }
  };

  const resetUpload = () => {
    setFile(null);
    setFilePreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-500/20";
    if (score >= 60) return "bg-yellow-500/20";
    if (score >= 40) return "bg-orange-500/20";
    return "bg-red-500/20";
  };

  const getScoreRing = (score) => {
    if (score >= 80) return "border-green-500";
    if (score >= 60) return "border-yellow-500";
    if (score >= 40) return "border-orange-500";
    return "border-red-500";
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'contactInfo': return <User className="h-5 w-5" />;
      case 'skills': return <Code className="h-5 w-5" />;
      case 'experience': return <Briefcase className="h-5 w-5" />;
      case 'education': return <GraduationCap className="h-5 w-5" />;
      case 'completeness': return <FileText className="h-5 w-5" />;
      default: return <PieChart className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'contactInfo': return 'Contact Information';
      case 'skills': return 'Skills';
      case 'experience': return 'Experience';
      case 'education': return 'Education';
      case 'completeness': return 'Completeness';
      default: return category;
    }
  };

  return (
    <Dashboard>
      <Toaster position="top-right" richColors />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              Resume Analyzer
              <Brain className="h-8 w-8 text-green-400" />
            </h1>
            <p className="text-white/60">
              Upload your resume for AI-powered analysis and optimization
            </p>
          </div>

          {result && (
            <div className="flex items-center gap-3">
              <Button
                onClick={resetUpload}
                className="bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 px-4 flex items-center gap-2 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                New Analysis
              </Button>
            </div>
          )}
        </motion.div>

        {/* Upload Section */}
        {!result ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-8"
          >
            <form onSubmit={handleSubmit}>
              {/* File Drop Zone - Separate clickable area */}
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer mb-6 ${
                  isDragging
                    ? "border-green-500 bg-green-500/10"
                    : "border-white/20 hover:border-green-500/50 hover:bg-white/5"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-green-500/20 rounded-full">
                    <Upload className="h-12 w-12 text-green-400" />
                  </div>
                  
                  <div>
                    <p className="text-xl font-semibold text-white mb-2">
                      {file ? file.name : "Drop your resume here"}
                    </p>
                    <p className="text-white/40">
                      {file
                        ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                        : "or click to browse (PDF only, max 5MB)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Separate from drop zone */}
              {file && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-3 px-8 flex items-center gap-2 cursor-pointer min-w-[200px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Award className="h-5 w-5" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={resetUpload}
                    className="bg-white/5 hover:bg-white/10 text-white rounded-lg py-3 px-8 cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FileText className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">PDF Parsing</h3>
                  <p className="text-white/40 text-sm">
                    Extract text and structure from your PDF resume
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Brain className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">AI Analysis</h3>
                  <p className="text-white/40 text-sm">
                    Get detailed insights and improvement suggestions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Target className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Category Scoring</h3>
                  <p className="text-white/40 text-sm">
                    Detailed breakdown across 5 key categories
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Results Section */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Score Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border border-green-800/30 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Score Circle */}
                <div className="relative">
                  <div className={`w-32 h-32 rounded-full border-4 ${getScoreRing(result.scores.overall)} flex items-center justify-center`}>
                    <div className="text-center">
                      <span className={`text-4xl font-bold ${getScoreColor(result.scores.overall)}`}>
                        {result.scores.overall}
                      </span>
                      <span className="text-white/40 text-sm block">/100</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    Resume Analysis Summary
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {result.evaluation.summary}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {result.metadata.pageCount}
                      </div>
                      <div className="text-white/40 text-sm">Pages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {result.data.skills.length}
                      </div>
                      <div className="text-white/40 text-sm">Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {result.data.experience.length}
                      </div>
                      <div className="text-white/40 text-sm">Experiences</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {result.data.education.length}
                      </div>
                      <div className="text-white/40 text-sm">Education</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Scores Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-4"
            >
              {Object.entries(result.scores.categories).map(([key, category], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      {getCategoryIcon(key)}
                    </div>
                    <span className="text-xs text-white/40">{category.weight}</span>
                  </div>
                  <h4 className="text-white/60 text-sm mb-1">{getCategoryLabel(key)}</h4>
                  <div className="flex items-end justify-between">
                    <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                      {category.score}
                    </span>
                    <span className="text-white/40 text-sm">/100</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.score}%` }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                      className={`h-full rounded-full ${
                        category.score >= 80 ? 'bg-green-500' :
                        category.score >= 60 ? 'bg-yellow-500' :
                        category.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tabs */}
            <div className="border-b border-white/10">
              <div className="flex gap-6 overflow-x-auto pb-1">
                {["overview", "personal", "skills", "experience", "education", "scores"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 capitalize transition-colors relative cursor-pointer whitespace-nowrap ${
                      activeTab === tab
                        ? "text-green-400"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {tab === "scores" ? "Detailed Scores" : tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {/* Strengths */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      {result.evaluation.strengths.length > 0 ? (
                        result.evaluation.strengths.map((strength, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-white/80">{strength}</span>
                          </motion.li>
                        ))
                      ) : (
                        <li className="text-white/60">No strengths identified</li>
                      )}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-3">
                      {result.evaluation.improvements.length > 0 ? (
                        result.evaluation.improvements.map((improvement, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <span className="text-white/80">{improvement}</span>
                          </motion.li>
                        ))
                      ) : (
                        <li className="text-white/60">No improvements identified</li>
                      )}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/40">Score:</span>
                      <span className={`text-lg font-bold ${getScoreColor(result.scores.categories.contactInfo.score)}`}>
                        {result.scores.categories.contactInfo.score}%
                      </span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <User className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white/40 text-sm">Full Name</p>
                        <p className="text-white text-lg">{result.data.personal_info.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Mail className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white/40 text-sm">Email Address</p>
                        <p className="text-white text-lg">{result.data.personal_info.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Phone className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white/40 text-sm">Phone Number</p>
                        <p className="text-white text-lg">{result.data.personal_info.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <MapPin className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white/40 text-sm">Location</p>
                        <p className="text-white text-lg">{result.data.personal_info.location}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Skills ({result.data.skills.length})</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/40">Score:</span>
                      <span className={`text-lg font-bold ${getScoreColor(result.scores.categories.skills.score)}`}>
                        {result.scores.categories.skills.score}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {result.data.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Experience Tab */}
              {activeTab === "experience" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">Work Experience</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/40">Score:</span>
                      <span className={`text-lg font-bold ${getScoreColor(result.scores.categories.experience.score)}`}>
                        {result.scores.categories.experience.score}%
                      </span>
                    </div>
                  </div>
                  {result.data.experience.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-white">{exp.job_title}</h4>
                          <div className="flex items-center gap-2 text-white/60 mt-1">
                            <Building className="h-4 w-4" />
                            <span>{exp.company}</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-white/80 leading-relaxed">{exp.description}</p>
                      
                      {/* Experience quality indicators */}
                      {result.scores.categories.experience.details.experiences && (
                        <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
                          {result.scores.categories.experience.details.experiences[index]?.hasQualityDescription && (
                            <span className="flex items-center gap-1 text-xs text-green-400">
                              <CheckCircle className="h-3 w-3" /> Quality Description
                            </span>
                          )}
                          {result.scores.categories.experience.details.experiences[index]?.hasAchievements && (
                            <span className="flex items-center gap-1 text-xs text-green-400">
                              <Zap className="h-3 w-3" /> Achievements
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Education Tab */}
              {activeTab === "education" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">Education</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/40">Score:</span>
                      <span className={`text-lg font-bold ${getScoreColor(result.scores.categories.education.score)}`}>
                        {result.scores.categories.education.score}%
                      </span>
                    </div>
                  </div>
                  {result.data.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-6"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold text-white">{edu.degree}</h4>
                          <p className="text-white/60 mt-1">{edu.institution}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg">
                          {edu.year}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Detailed Scores Tab */}
              {activeTab === "scores" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Detailed Category Analysis</h3>
                    
                    {Object.entries(result.scores.categories).map(([key, category], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="mb-6 last:mb-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                              {getCategoryIcon(key)}
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{getCategoryLabel(key)}</h4>
                              <p className="text-white/40 text-xs">Weight: {category.weight}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                              {category.score}
                            </span>
                            <span className="text-white/40 text-sm">/100</span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${category.score}%` }}
                            transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                            className={`h-full rounded-full ${
                              category.score >= 80 ? 'bg-green-500' :
                              category.score >= 60 ? 'bg-yellow-500' :
                              category.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                          />
                        </div>

                        {/* Category details */}
                        <div className="bg-white/5 rounded-lg p-4">
                          <h5 className="text-white/60 text-sm mb-2">Details:</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(category.details).map(([detailKey, detailValue]) => {
                              if (typeof detailValue === 'boolean') {
                                return (
                                  <div key={detailKey} className="flex items-center gap-2">
                                    {detailValue ? (
                                      <CheckCircle className="h-4 w-4 text-green-400" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-400" />
                                    )}
                                    <span className="text-white/60 text-sm capitalize">
                                      {detailKey.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                  </div>
                                );
                              } else if (typeof detailValue === 'number') {
                                return (
                                  <div key={detailKey} className="flex items-center gap-2">
                                    <span className="text-green-400 font-medium">{detailValue}</span>
                                    <span className="text-white/60 text-sm capitalize">
                                      {detailKey.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* File Metadata */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/40 flex flex-wrap gap-4">
              <span>File: {result.metadata.filename}</span>
              <span>•</span>
              <span>Pages: {result.metadata.pageCount}</span>
              <span>•</span>
              <span>Characters: {result.metadata.textLength}</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Dashboard>
  );
}

export default ResumeAnalyzer;