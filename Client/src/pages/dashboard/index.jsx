"use client";

import Dashboard from "@/pagecomponents/Dashboard";
import { useGetRecentjobQuery, useGetDashboardstatusQuery } from "@/store/apiSlice";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
  PieChart,
  BarChart3,
  LayoutGrid,
  List,
  ChevronRight,
  Globe,
  Mail,
  Code,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Button } from "@/components/ui/button";

function Index() {
  const { data: recentJobsData, isLoading: recentJobsLoading, error: recentJobsError } = useGetRecentjobQuery();
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useGetDashboardstatusQuery();
  
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0,
    saved: 0,
    successRate: 0,
    interviewRate: 0,
    offerRate: 0,
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [viewMode, setViewMode] = useState("card");
  const [recentJobs, setRecentJobs] = useState([]);

  const COLORS = {
    applied: "#3b82f6",
    interview: "#eab308",
    offer: "#22c55e",
    rejected: "#ef4444",
    saved: "#8b5cf6",
    manual: "#8884d8",
    "chrome-extension": "#82ca9d",
    email: "#ffc658"
  };

  // Process dashboard stats when they arrive
  useEffect(() => {
    if (dashboardStats) {
      console.log("Dashboard Stats:", dashboardStats);
      
      // Update stats from dashboard data
      setStats({
        total: dashboardStats.overview?.totalJobs || 0,
        applied: dashboardStats.overview?.activeApplications || 0,
        interviewing: dashboardStats.overview?.interviews || 0,
        offered: dashboardStats.overview?.offers || 0,
        rejected: dashboardStats.overview?.rejected || 0,
        saved: dashboardStats.overview?.savedJobs || 0,
        successRate: dashboardStats.overview?.successRate || 0,
        interviewRate: dashboardStats.overview?.interviewRate || 0,
        offerRate: dashboardStats.overview?.offerRate || 0,
      });

      // Set status distribution data from charts.statusPieData
      if (dashboardStats.charts?.statusPieData && dashboardStats.charts.statusPieData.length > 0) {
        setStatusData(dashboardStats.charts.statusPieData);
      }

      // Set timeline data from charts.timelineData
      if (dashboardStats.charts?.timelineData && dashboardStats.charts.timelineData.length > 0) {
        setTimelineData(dashboardStats.charts.timelineData);
      }

      // Set monthly trends data from charts.monthlyTrendsData
      if (dashboardStats.charts?.monthlyTrendsData && dashboardStats.charts.monthlyTrendsData.length > 0) {
        setMonthlyData(dashboardStats.charts.monthlyTrendsData);
      }

      // Set source distribution data from charts.sourcePieData
      if (dashboardStats.charts?.sourcePieData && dashboardStats.charts.sourcePieData.length > 0) {
        setSourceData(dashboardStats.charts.sourcePieData);
      }
    }
  }, [dashboardStats]);

  // Set recent jobs when data arrives (from recent jobs query)
  useEffect(() => {
    if (recentJobsData?.data) {
      console.log("Recent jobs (last 5):", recentJobsData.data);
      setRecentJobs(recentJobsData.data);
    } else if (dashboardStats?.recentActivity) {
      // Fallback to recentActivity from dashboard stats
      setRecentJobs(dashboardStats.recentActivity);
    }
  }, [recentJobsData, dashboardStats]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
      case "interview":
      case "interviewing":
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            Interview
          </span>
        );
      case "offer":
      case "offered":
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
            {status || "Unknown"}
          </span>
        );
    }
  };

  // Get source icon
  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case "manual":
        return <Briefcase className="h-4 w-4" />;
      case "chrome-extension":
        return <Code className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-cyan-800/30 rounded-lg p-3 text-white">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-white/80">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const isLoading = recentJobsLoading || statsLoading;
  const error = recentJobsError || statsError;

  if (isLoading) {
    return (
      <Dashboard>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
          <p className="text-white/60">Loading your dashboard...</p>
        </div>
      </Dashboard>
    );
  }

  if (error) {
    return (
      <Dashboard>
        <div className="text-center text-red-400 p-8 bg-red-950/20 rounded-xl border border-red-800/30">
          <XCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-white/60">Please try again later.</p>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Job Applications Dashboard
            </h1>
            <p className="text-white/60">
              Track and manage all your job applications in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/applications/new">
              <button className="bg-[var(--buttonbg)] hover:bg-[var(--hoverbtnbg)] cursor-pointer text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Add New Application
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-sm mb-1">Total Jobs</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-blue-400/60 text-sm mb-1">Applied</p>
            <p className="text-2xl font-bold text-blue-400">{stats.applied}</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-yellow-400/60 text-sm mb-1">Interview</p>
            <p className="text-2xl font-bold text-yellow-400">
              {stats.interviewing}
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-green-400/60 text-sm mb-1">Offers</p>
            <p className="text-2xl font-bold text-green-400">{stats.offered}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400/60 text-sm mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <p className="text-indigo-400/60 text-sm mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-indigo-400">{stats.successRate}%</p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
            <p className="text-cyan-400/60 text-sm mb-1">This Month</p>
            <p className="text-2xl font-bold text-cyan-400">{dashboardStats?.overview?.appliedThisMonth || 0}</p>
          </div>
        </div>

        {/* Charts Section - 2 columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart - Monthly Applications */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Monthly Applications
              </h2>
            </div>
            <div className="h-64">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="applied" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="interviews" fill="#eab308" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="offers" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white/40">
                  No monthly data available
                </div>
              )}
            </div>
          </div>

          {/* Pie Chart - Status Distribution */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Status Distribution
              </h2>
            </div>
            <div className="h-64">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white/40">
                  No status data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second row of charts - 2 columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Source Distribution Pie Chart */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Application Sources
              </h2>
            </div>
            <div className="h-64">
              {sourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {sourceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white/40">
                  No source data available
                </div>
              )}
            </div>
          </div>

          {/* Success Metrics Cards */}
          <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-800/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Success Metrics
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/40 text-sm mb-1">Interview Rate</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {stats.interviewRate}%
                </p>
                <p className="text-white/40 text-xs mt-1">
                  {stats.interviewing} of {stats.total - stats.saved} applications
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/40 text-sm mb-1">Offer Rate</p>
                <p className="text-3xl font-bold text-green-400">
                  {stats.offerRate}%
                </p>
                <p className="text-white/40 text-xs mt-1">
                  {stats.offered} of {stats.total - stats.saved} applications
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/40 text-sm mb-1">Rejection Rate</p>
                <p className="text-3xl font-bold text-red-400">
                  {stats.rejected > 0 && stats.total > 0 
                    ? Math.round((stats.rejected / (stats.total - stats.saved)) * 100) 
                    : 0}%
                </p>
                <p className="text-white/40 text-xs mt-1">
                  {stats.rejected} of {stats.total - stats.saved} applications
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/40 text-sm mb-1">Conversion</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {stats.successRate}%
                </p>
                <p className="text-white/40 text-xs mt-1">
                  Applied → Offer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Chart - Applications Over Time (if data exists) */}
        {timelineData.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Applications Timeline (Last 30 Days)
              </h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Jobs Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-semibold text-white">
                {viewMode === "card"
                  ? "Recent Applications"
                  : "Recent Applications (List)"}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-white/60 text-sm">
                  {recentJobs.length} of {stats.total} total
                </span>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
                  <Button
                    onClick={() => setViewMode("card")}
                    className={`p-2 rounded-md transition-colors cursor-pointer ${
                      viewMode === "card"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    title="Card View"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors cursor-pointer ${
                      viewMode === "list"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    title="List View"
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Jobs Display */}
          {recentJobs && recentJobs.length > 0 ? (
            <>
              {/* Card View */}
              {viewMode === "card" && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {recentJobs.map((job) => (
                    <div
                      key={job._id}
                      className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-900/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/dashboard/applications/${job._id}`)
                      }
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                            {job.position}
                          </h3>
                          <div className="flex items-center gap-2 text-white/60 mt-1">
                            <Building className="h-4 w-4" />
                            <span>{job.companyName}</span>
                          </div>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>

                      {/* Details */}
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
                              ${job.salaryMin?.toLocaleString() || 0}
                              {job.salaryMin && job.salaryMax && " - "}
                              ${job.salaryMax?.toLocaleString() || 0}
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
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
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
                            Applied Date
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
                        {recentJobs.map((job) => (
                          <tr
                            key={job._id}
                            className="border-b border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                            onClick={() =>
                              (window.location.href = `/dashboard/applications/${job._id}`)
                            }
                          >
                            <td className="p-4">
                              <div>
                                <p className="text-white font-medium">
                                  {job.position}
                                </p>
                                {job.notes && (
                                  <p className="text-white/40 text-xs mt-1 line-clamp-1">
                                    {job.notes}
                                  </p>
                                )}
                              </div>
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
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-white/40" />
                                <span className="text-white/80">
                                  {job.location || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-white/40" />
                                <span className="text-white/80">
                                  {formatDate(job.appliedDate)}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">{getStatusBadge(job.status)}</td>
                            <td className="p-4">
                              {job.salaryMin || job.salaryMax ? (
                                <span className="text-white/80">
                                  ${job.salaryMin || 0} - ${job.salaryMax || 0}
                                </span>
                              ) : (
                                <span className="text-white/40">
                                  Not specified
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <Button
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/dashboard/applications/${job._id}`;
                                }}
                              >
                                <ChevronRight className="h-5 w-5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* View All Link */}
              <div className="text-center mt-6">
                <Link href="/dashboard/applications">
                  <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    View All Applications →
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <Briefcase className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Applications Yet
              </h3>
              <p className="text-white/60 mb-6">
                Start tracking your job applications today
              </p>
              <Link href="/dashboard/applications/new">
                <button className="bg-[var(--buttonbg)] hover:bg-[var(--hoverbtnbg)] text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  Add Your First Application
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
}

export default Index;