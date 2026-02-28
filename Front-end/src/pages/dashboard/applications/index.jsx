"use client";

import Dashboard from "@/pagecomponents/Dashboard";
import {
  useLazyGetJobsQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
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
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Applications() {
  // Use lazy query for better control over when data is fetched
  const [triggerGetJobs, { data: jobs, isLoading, error, isFetching }] = useLazyGetJobsQuery();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  const [viewMode, setViewMode] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch jobs when component mounts
  useEffect(() => {
    triggerGetJobs();
  }, [triggerGetJobs]);

  // Refetch when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      triggerGetJobs();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [triggerGetJobs]);

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

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
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

  // Handle edit button click
  const handleEditClick = (job) => {
    setSelectedJob(job);
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
      followUpDate: job.followUpDate
        ? formatDateForInput(job.followUpDate)
        : "",
    });
    setShowEditModal(true);
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
      await updateJob({
        id: selectedJob._id,
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
      setSelectedJob(null);
      triggerGetJobs(); // Refresh the list
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error("Failed to update application. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedJob) return;

    try {
      await deleteJob(selectedJob._id).unwrap();
      toast.success("Application deleted successfully!");
      setShowDeleteModal(false);
      setSelectedJob(null);
      triggerGetJobs(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete application. Please try again.");
    }
  };

  // Filter jobs based on search and status
  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      job.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location &&
        job.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
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
            Loading your applications...
          </motion.p>
        </div>
      </Dashboard>
    );
  }

  if (error && !jobs) {
    return (
      <Dashboard>
        <Toaster position="top-right" richColors />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-10 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 rounded-2xl border border-cyan-800/30 max-w-md mx-auto mt-20"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-20"></div>
            <XCircle className="h-20 w-20 mx-auto relative text-cyan-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-cyan-400">
            Error Loading Applications
          </h3>
          <p className="text-white/60 mb-8">
            Please try again later.
          </p>
          <Button
            onClick={() => triggerGetJobs()}
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

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[9999] backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
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
        {showDeleteModal && selectedJob && (
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
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">
                  Delete Application
                </h2>
                <p className="text-white/60 mb-2">
                  Are you sure you want to delete this application?
                </p>
                <p className="text-white/40 text-sm mb-6">
                  {selectedJob.position} at {selectedJob.companyName}
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
              Applications
              <Briefcase className="h-8 w-8 text-cyan-400" />
            </h1>
            <p className="text-white/60">Manage all your job applications</p>
          </div>

          {/* View Toggle and Add Button */}
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
              onClick={() => triggerGetJobs()}
              className="bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 px-3 cursor-pointer"
              title="Refresh"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
            <Link href="/dashboard/applications/new">
              <button className="bg-[var(--buttonbg)] hover:bg-[var(--hoverbtnbg)] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer">
                <Briefcase className="h-4 w-4" />
                Add New
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
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
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-8 py-2 text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/40 text-sm"
        >
          Showing {filteredJobs?.length || 0} of {jobs?.length || 0}{" "}
          applications
        </motion.p>

        {/* Applications Display */}
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
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job._id}
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
                        {getStatusBadge(job.status)}

                        {/* Actions Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                              <MoreVertical className="h-4 w-4 text-white/60" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-900 border-white/10 text-white">
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                              onClick={() =>
                                (window.location.href = `/dashboard/applications/${job._id}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2 text-cyan-400" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                              onClick={() => handleEditClick(job)}
                            >
                              <Edit className="h-4 w-4 mr-2 text-yellow-400" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-red-400"
                              onClick={() => {
                                setSelectedJob(job);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2 text-red-400" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                      <span>ID: {job._id.slice(-6)}</span>
                      {job.followUpDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Follow-up: {formatDate(job.followUpDate)}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
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
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job, index) => (
                        <motion.tr
                          key={job._id}
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
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/applications/${job._id}`}>
                                <button
                                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-cyan-400"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </Link>
                              <button
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-yellow-400"
                                onClick={() => handleEditClick(job)}
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-red-400"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setShowDeleteModal(true);
                                }}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
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
            <Briefcase className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Applications Found
            </h3>
            <p className="text-white/60 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start tracking your job applications today"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Link href="/dashboard/applications/new">
                <button className="bg-[var(--buttonbg)] hover:bg-[var(--hoverbtnbg)] text-white px-6 py-3 rounded-xl font-medium transition-colors cursor-pointer">
                  Add Your First Application
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </motion.div>
    </Dashboard>
  );
}

export default Applications;