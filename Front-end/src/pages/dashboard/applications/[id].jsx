"use client";

import Dashboard from "@/pagecomponents/Dashboard";
import { useGetJobbyIdQuery, useUpdateJobMutation, useDeleteJobMutation } from "@/store/apiSlice";
import { useRouter } from "next/router";
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  ArrowLeft,
  Loader2,
  XCircle,
  Edit,
  Trash2,
  Share2,
  Printer,
  Heart,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  X,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useSelector } from "react-redux";

export default function JobDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [isIdReady, setIsIdReady] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalContentRef = useRef(null);
  const {front_url} = useSelector((state)=>state.auth)
  
  // Form state for editing
  const [editFormData, setEditFormData] = useState({
    position: "",
    companyName: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    status: "",
    jobUrl: "",
    notes: "",
    resumeVersion: "",
    followUpDate: "",
  });

  // RTK Mutations
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();
  
  // Only run query when id is available
  const {
    data: job,
    isLoading: isJobLoading,
    error,
    refetch,
  } = useGetJobbyIdQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (id) {
      setIsIdReady(true);
    }
  }, [id]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showEditModal || showDeleteModal || showShareModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showEditModal, showDeleteModal, showShareModal]);

  // Populate edit form when job data is available
  useEffect(() => {
    if (job) {
      setEditFormData({
        position: job.position || "",
        companyName: job.companyName || "",
        location: job.location || "",
        salaryMin: job.salaryMin || "",
        salaryMax: job.salaryMax || "",
        status: job.status || "applied",
        jobUrl: job.jobUrl || "",
        notes: job.notes || "",
        resumeVersion: job.resumeVersion || "",
        followUpDate: job.followUpDate ? job.followUpDate.split("T")[0] : "",
      });
    }
  }, [job]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await updateJob({
        id: job._id,
        ...editFormData,
        salaryMin: editFormData.salaryMin
          ? Number(editFormData.salaryMin)
          : null,
        salaryMax: editFormData.salaryMax
          ? Number(editFormData.salaryMax)
          : null,
      }).unwrap();

      toast.success("Application updated successfully!");
      setShowEditModal(false);
      refetch(); // Refresh the data
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error("Failed to update application. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteJob(job._id).unwrap();

      toast.success("Application deleted successfully!");
      setShowDeleteModal(false);

      // Redirect to applications list after deletion
      setTimeout(() => {
        router.push("/dashboard/applications");
      }, 1500);
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete application. Please try again.");
    }
  };

  // Generate shareable link
  const getShareableLink = () => {
    return `${front_url}/dashboard/applications/${id}`;
  };

  // Handle copy to clipboard
  const handleCopyLink = async () => {
    const link = getShareableLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  // Get status badge with enhanced styling
  const getStatusBadge = (status) => {
    const styles = {
      applied: {
        bg: "bg-gradient-to-r from-blue-500/20 to-blue-600/20",
        text: "text-blue-400",
        border: "border-blue-500/30",
        icon: <Briefcase className="h-3.5 w-3.5" />,
      },
      interview: {
        bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        icon: <Calendar className="h-3.5 w-3.5" />,
      },
      interviewing: {
        bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        icon: <Calendar className="h-3.5 w-3.5" />,
      },
      offer: {
        bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
        text: "text-green-400",
        border: "border-green-500/30",
        icon: <Briefcase className="h-3.5 w-3.5" />,
      },
      offered: {
        bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
        text: "text-green-400",
        border: "border-green-500/30",
        icon: <Briefcase className="h-3.5 w-3.5" />,
      },
      rejected: {
        bg: "bg-gradient-to-r from-red-500/20 to-rose-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
        icon: <XCircle className="h-3.5 w-3.5" />,
      },
    };

    const style = styles[status?.toLowerCase()] || {
      bg: "bg-gradient-to-r from-gray-500/20 to-gray-600/20",
      text: "text-gray-400",
      border: "border-gray-500/30",
      icon: <Briefcase className="h-3.5 w-3.5" />,
    };

    return (
      <motion.span
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={`px-4 py-2 rounded-full text-sm font-medium border ${style.bg} ${style.text} ${style.border} flex items-center gap-2 shadow-lg backdrop-blur-sm`}
      >
        {style.icon}
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Applied"}
      </motion.span>
    );
  };

  // Add debug logging
  useEffect(() => {
    console.log("ID from router:", id);
    console.log("isIdReady:", isIdReady);
    console.log("isJobLoading:", isJobLoading);
    console.log("Job data:", job);
    console.log("Error:", error);
  }, [id, isIdReady, isJobLoading, job, error]);

  // Show loading while waiting for id or data
  if (!isIdReady || isJobLoading) {
    return (
      <Dashboard>
        <Toaster position="top-right" richColors />
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-16 w-16 text-cyan-400" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/60 mt-6 text-lg"
          >
            {!isIdReady ? "Preparing..." : "Loading application details..."}
          </motion.p>
        </div>
      </Dashboard>
    );
  }

  // Show error if job not found
  if (error || !job) {
    return (
      <Dashboard>
        <Toaster position="top-right" richColors />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-10 bg-gradient-to-br from-red-950/30 to-rose-950/30 rounded-2xl border border-red-800/30 max-w-md mx-auto mt-20"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20"></div>
            <AlertTriangle className="h-20 w-20 mx-auto relative text-red-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-red-400">
            Application Not Found
          </h3>
          <p className="text-white/60 mb-8">
            The application you're looking for doesn't exist or has been
            removed.
          </p>
          <Link href="/dashboard/applications">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-cyan-500/25 inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Applications
            </motion.button>
          </Link>
        </motion.div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <Toaster position="top-right" richColors />

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[9999] backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-cyan-400" />
                    Share Application
                  </h2>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5 text-white/60" />
                  </button>
                </div>

                <p className="text-white/60 mb-4">
                  Share this link to allow others to view this application:
                </p>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 font-mono text-sm truncate">
                    {getShareableLink()}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer group"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : (
                      <Copy className="h-5 w-5 text-white/60 group-hover:text-white" />
                    )}
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCopyLink}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg py-2 cursor-pointer"
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[9999] backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              ref={modalContentRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-black/50 backdrop-blur-sm border-b border-white/10 p-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-semibold text-white">
                  Edit Application
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5 text-white/60" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position" className="text-white/80">
                      Position *
                    </Label>
                    <Input
                      id="position"
                      value={editFormData.position}
                      onChange={handleEditChange}
                      required
                      className="mt-1 bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyName" className="text-white/80">
                      Company *
                    </Label>
                    <Input
                      id="companyName"
                      value={editFormData.companyName}
                      onChange={handleEditChange}
                      required
                      className="mt-1 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-white/80">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={editFormData.location}
                    onChange={handleEditChange}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salaryMin" className="text-white/80">
                      Salary Min
                    </Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={editFormData.salaryMin}
                      onChange={handleEditChange}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="salaryMax" className="text-white/80">
                      Salary Max
                    </Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={editFormData.salaryMax}
                      onChange={handleEditChange}
                      className="mt-1 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status" className="text-white/80">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={editFormData.status}
                    onChange={handleEditChange}
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="jobUrl" className="text-white/80">
                    Job URL
                  </Label>
                  <Input
                    id="jobUrl"
                    type="url"
                    value={editFormData.jobUrl}
                    onChange={handleEditChange}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="resumeVersion" className="text-white/80">
                    Resume Version
                  </Label>
                  <Input
                    id="resumeVersion"
                    value={editFormData.resumeVersion}
                    onChange={handleEditChange}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="followUpDate" className="text-white/80">
                    Follow-up Date
                  </Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={editFormData.followUpDate}
                    onChange={handleEditChange}
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-white/80">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    rows={4}
                    value={editFormData.notes}
                    onChange={handleEditChange}
                    className="mt-1 bg-white/5 border-white/10 text-white resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg py-2 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">
                  Delete Application
                </h2>
                <p className="text-white/60 mb-6">
                  Are you sure you want to delete this application? This action
                  cannot be undone.
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg py-2 cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto px-4 pb-10"
      >
        {/* Navigation Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Applications
          </button>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Save to favorites"
            >
              <Heart className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowShareModal(true)}
              className="p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Print"
            >
              <Printer className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 p-8 mb-8"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-8 w-8 text-cyan-400" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    {job.position}
                  </span>
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-white/70">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="text-lg">{job.companyName}</span>
                </div>
                {job.location && (
                  <>
                    <span className="text-white/30">•</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              {getStatusBadge(job.status)}
              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Original Posting
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Key Details */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: Calendar,
                  label: "Applied",
                  value: formatDate(job.appliedDate),
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Clock,
                  label: "Follow-up",
                  value: job.followUpDate
                    ? formatDate(job.followUpDate)
                    : "Not set",
                  color: "from-yellow-500 to-amber-500",
                },
                {
                  icon: DollarSign,
                  label: "Salary",
                  value: job.salaryMin
                    ? `${job.salaryMin} - ${job.salaryMax}`
                    : "Not specified",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: FileText,
                  label: "Resume",
                  value: job.resumeVersion || "v1",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10 p-4 hover:border-white/20 transition-all duration-300"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <item.icon className="h-5 w-5 text-white/40 mb-2" />
                  <p className="text-sm text-white/40">{item.label}</p>
                  <p className="text-white font-medium text-sm mt-1 line-clamp-1">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Notes Section */}
            {job.notes && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">Notes</h2>
                </div>
                <p className="text-white/70 whitespace-pre-wrap leading-relaxed">
                  {job.notes}
                </p>
              </motion.div>
            )}

            {/* Timeline */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Application Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="absolute top-4 left-1 w-0.5 h-12 bg-white/10"></div>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Application Submitted
                    </p>
                    <p className="text-white/40 text-sm">
                      {formatDate(job.appliedDate)}
                    </p>
                  </div>
                </div>
                {job.followUpDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">
                        Follow-up Scheduled
                      </p>
                      <p className="text-white/40 text-sm">
                        {formatDate(job.followUpDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Additional Info */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Source Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Application Source
              </h2>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <Briefcase className="h-5 w-5 text-cyan-400" />
                <span className="text-white capitalize">
                  {job.source || "Manual Entry"}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    console.log("Edit button clicked");
                    setShowEditModal(true);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Edit className="h-5 w-5 text-cyan-400" />
                    <span className="text-white">Edit Application</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                </motion.button>

                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    console.log("Delete button clicked");
                    setShowDeleteModal(true);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-red-400" />
                    <span className="text-red-400">Delete Application</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-red-400/40 group-hover:text-red-400 transition-colors" />
                </motion.button>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Information
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/40">Application ID</span>
                  <span className="text-white font-mono">
                    {job._id.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/40">Created</span>
                  <span className="text-white">
                    {formatDate(job.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-white/40">Last Updated</span>
                  <span className="text-white">
                    {formatDate(job.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Applications */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Similar Applications
          </h2>
          <p className="text-white/40">No similar applications found.</p>
        </motion.div>
      </motion.div>
    </Dashboard>
  );
}