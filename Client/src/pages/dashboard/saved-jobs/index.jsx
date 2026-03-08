"use client";

import Dashboard from "@/pagecomponents/Dashboard";
import {
  useGetAllsavedQuery,
  useLazyGetAllsavedQuery,
  useUnsaveJobMutation,
} from "@/store/apiSlice";
import { useState, useEffect } from "react";
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Loader2,
  XCircle,
  LayoutGrid,
  List,
  Search,
  Trash2,
  Eye,
  Heart,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

function SavedJobs() {
  // Use lazy query for better control over when data is fetched
  const [triggerGetSaved, { data: savedJobs, isLoading, error, isFetching }] = useLazyGetAllsavedQuery();
  const [unsaveJob, { isLoading: isUnsaving }] = useUnsaveJobMutation();

  const [viewMode, setViewMode] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSaved, setSelectedSaved] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch saved jobs when component mounts
  useEffect(() => {
    triggerGetSaved();
  }, [triggerGetSaved]);

  // Refetch when window gains focus (optional)
  useEffect(() => {
    const handleFocus = () => {
      triggerGetSaved();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [triggerGetSaved]);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
            Applied
          </span>
        );
      case "interviewing":
      case "interview":
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            Interview
          </span>
        );
      case "offered":
      case "offer":
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            Offer
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  // Handle unsave
  const handleUnsave = async () => {
    if (!selectedSaved) return;

    try {
      await unsaveJob(selectedSaved._id).unwrap();
      toast.success("Job removed from saved jobs!");
      setShowDeleteModal(false);
      setSelectedSaved(null);
      // Refetch after successful unsave
      triggerGetSaved();
    } catch (error) {
      console.error("Failed to unsave job:", error);
      toast.error("Failed to remove job. Please try again.");
    }
  };

  // Filter saved jobs based on search
  const filteredJobs = savedJobs?.filter((saved) => {
    const job = saved.jobId;
    if (!job) return false;
    
    const matchesSearch =
      job.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location &&
        job.location.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Show loading only on initial load
  if (isLoading && initialLoad) {
    return (
      <Dashboard>
        <Toaster position="top-right" richColors />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
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
            Loading your saved jobs...
          </motion.p>
        </div>
      </Dashboard>
    );
  }

  if (error && !savedJobs) {
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
            <XCircle className="h-20 w-20 mx-auto relative text-red-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-red-400">
            Error Loading Saved Jobs
          </h3>
          <p className="text-white/60 mb-8">
            Please try again later.
          </p>
          <Button
            onClick={() => triggerGetSaved()}
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg py-2 px-6 cursor-pointer"
          >
            Try Again
          </Button>
        </motion.div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <Toaster position="top-right" richColors />

      {/* Loading Overlay for subsequent loads */}
      {isFetching && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
            <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
            <span className="text-cyan-400 text-sm">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Delete/Unsave Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedSaved && (
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
                  <Heart className="h-8 w-8 text-red-400 fill-current" />
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">
                  Remove from Saved Jobs
                </h2>
                <p className="text-white/60 mb-2">
                  Are you sure you want to remove this job from your saved list?
                </p>
                <p className="text-white/40 text-sm mb-6">
                  {selectedSaved.jobId?.position} at {selectedSaved.jobId?.companyName}
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUnsave}
                    disabled={isUnsaving}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUnsaving ? "Removing..." : "Remove"}
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
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              Saved Jobs
              <Heart className="h-8 w-8 text-red-500 fill-current" />
            </h1>
            <p className="text-white/60">Jobs you've saved for later</p>
          </div>

          {/* View Toggle and Refresh Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-md transition-colors cursor-pointer ${
                  viewMode === "card"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                title="Card View"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                title="List View"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            <Button
              onClick={() => triggerGetSaved()}
              className="bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 px-3 cursor-pointer"
              title="Refresh"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by position, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/40 text-sm"
        >
          Showing {filteredJobs?.length || 0} of {savedJobs?.length || 0} saved jobs
        </motion.p>

        {/* Saved Jobs Display */}
        {filteredJobs && filteredJobs.length > 0 ? (
          <>
            {/* Card View */}
            {viewMode === "card" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredJobs.map((saved, index) => {
                  const job = saved.jobId;
                  if (!job) return null;
                  
                  return (
                    <motion.div
                      key={saved._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-900/50 hover:bg-white/10 transition-all duration-300"
                    >
                      {/* Header with Actions */}
                      <div className="flex justify-between items-start mb-4">
                        <Link
                          href={`/dashboard/applications/${job._id}`}
                          className="flex-1"
                        >
                          <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors cursor-pointer">
                            {job.position}
                          </h3>
                          <div className="flex items-center gap-2 text-white/60 mt-1">
                            <Building className="h-4 w-4" />
                            <span>{job.companyName}</span>
                          </div>
                        </Link>
                        <div className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-red-500 fill-current" />
                        </div>
                      </div>

                      {/* Details */}
                      <Link href={`/dashboard/applications/${job._id}`}>
                        <div className="space-y-2 mb-4">
                          {job.location && (
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                          )}

                          {(job.salaryMin || job.salaryMax) && (
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                              <DollarSign className="h-4 w-4" />
                              <span>
                                {job.salaryMin && `${job.salaryMin}`}
                                {job.salaryMin && job.salaryMax && " - "}
                                {job.salaryMax && `${job.salaryMax}`}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>Applied: {formatDate(job.appliedDate)}</span>
                          </div>

                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            {getStatusBadge(job.status)}
                          </div>

                          {job.notes && (
                            <div className="flex items-start gap-2 text-white/60 text-sm">
                              <FileText className="h-4 w-4 mt-0.5" />
                              <span className="line-clamp-2">{job.notes}</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Footer */}
                      <div className="flex justify-between items-center text-xs text-white/40 border-t border-white/10 pt-4">
                        <span>Saved: {formatDate(saved.createdAt)}</span>
                        <div className="flex items-center gap-2">
                          {job.jobUrl && (
                            <a
                              href={job.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-cyan-400 cursor-pointer"
                              title="View Original Posting"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-red-400 cursor-pointer"
                            onClick={() => {
                              setSelectedSaved(saved);
                              setShowDeleteModal(true);
                            }}
                            title="Remove from saved"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="text-left p-4 text-white/60 font-medium">
                          Position
                        </th>
                        <th className="text-left p-4 text-white/60 font-medium">
                          Company
                        </th>
                        <th className="text-left p-4 text-white/60 font-medium">
                          Location
                        </th>
                        <th className="text-left p-4 text-white/60 font-medium">
                          Applied
                        </th>
                        <th className="text-left p-4 text-white/60 font-medium">
                          Status
                        </th>
                        <th className="text-left p-4 text-white/60 font-medium">
                          Salary
                        </th>
                        <th className="text-left p-4 text-white/60 font-medium">
                          Saved On
                        </th>
                        <th className="text-left p-4 text-white/60 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((saved, index) => {
                        const job = saved.jobId;
                        if (!job) return null;
                        
                        return (
                          <motion.tr
                            key={saved._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="border-b border-white/10 hover:bg-white/10 transition-colors"
                          >
                            <td className="p-4">
                              <Link href={`/dashboard/applications/${job._id}`}>
                                <p className="text-white font-medium hover:text-cyan-400 transition-colors cursor-pointer">
                                  {job.position}
                                </p>
                              </Link>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-white/40" />
                                <span className="text-white">
                                  {job.companyName}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-white/80">
                                {job.location || "N/A"}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-white/80">
                                {formatDate(job.appliedDate)}
                              </span>
                            </td>
                            <td className="p-4">{getStatusBadge(job.status)}</td>
                            <td className="p-4">
                              {job.salaryMin || job.salaryMax ? (
                                <span className="text-white/80">
                                  {job.salaryMin || 0} - {job.salaryMax || 0}
                                </span>
                              ) : (
                                <span className="text-white/40">-</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="text-white/80">
                                {formatDate(saved.createdAt)}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Link href={`/dashboard/applications/${job._id}`}>
                                  <button
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-cyan-400"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </Link>
                                {job.jobUrl && (
                                  <a
                                    href={job.jobUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-cyan-400"
                                    title="View Original Posting"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                )}
                                <button
                                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-red-400"
                                  onClick={() => {
                                    setSelectedSaved(saved);
                                    setShowDeleteModal(true);
                                  }}
                                  title="Remove from saved"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16 bg-white/5 rounded-xl border border-white/10"
          >
            <Heart className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Saved Jobs Found
            </h3>
            <p className="text-white/60 mb-6">
              {searchTerm
                ? "Try adjusting your search"
                : "You haven't saved any jobs yet"}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/applications">
                <button className="bg-[var(--buttonbg)] hover:bg-[var(--hoverbtnbg)] text-white px-6 py-3 rounded-xl font-medium transition-colors cursor-pointer">
                  Browse Applications
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </motion.div>
    </Dashboard>
  );
}

export default SavedJobs;