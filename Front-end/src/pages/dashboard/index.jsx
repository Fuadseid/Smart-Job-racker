"use client";

import Dashboard from "@/pagecomponents/Dashboard";
import { useGetRecentjobQuery } from "@/store/apiSlice";
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
} from "recharts";
import { Button } from "@/components/ui/button";

function Index() {
  const { data: recentJobsData, isLoading, error } = useGetRecentjobQuery();
  
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0,
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [viewMode, setViewMode] = useState("card");
  const [recentJobs, setRecentJobs] = useState([]);

  // Set recent jobs when data arrives
  useEffect(() => {
    if (recentJobsData?.data) {
      console.log("Recent jobs (last 5):", recentJobsData.data);
      setRecentJobs(recentJobsData.data);
    }
  }, [recentJobsData]);

  const COLORS = ["#3b82f6", "#eab308", "#22c55e", "#ef4444", "#6b7280"];

  // Calculate stats from recent jobs
  useEffect(() => {
    if (recentJobs && recentJobs.length > 0) {
      // Calculate statistics from recent jobs only
      const applied = recentJobs.filter((job) => job.status === "applied").length;
      const interviewing = recentJobs.filter(
        (job) => job.status === "interviewing" || job.status === "interview",
      ).length;
      const offered = recentJobs.filter(
        (job) => job.status === "offered" || job.status === "offer",
      ).length;
      const rejected = recentJobs.filter((job) => job.status === "rejected").length;

      setStats({
        total: recentJobs.length,
        applied,
        interviewing,
        offered,
        rejected,
      });

      // Prepare data for status pie chart from recent jobs
      setStatusData([
        { name: "Applied", value: applied, color: "#3b82f6" },
        { name: "Interview", value: interviewing, color: "#eab308" },
        { name: "Offered", value: offered, color: "#22c55e" },
        { name: "Rejected", value: rejected, color: "#ef4444" },
      ]);

      // Prepare monthly application data from recent jobs
      const monthlyApps = {};
      recentJobs.forEach((job) => {
        const date = new Date(job.appliedDate);
        const monthYear = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        if (!monthlyApps[monthYear]) {
          monthlyApps[monthYear] = 0;
        }
        monthlyApps[monthYear]++;
      });

      const monthlyArray = Object.keys(monthlyApps)
        .map((month) => ({
          month,
          applications: monthlyApps[month],
        }))
        .sort((a, b) => {
          return new Date(a.month) - new Date(b.month);
        });

      setMonthlyData(monthlyArray);
    }
  }, [recentJobs]);

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

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-cyan-800/30 rounded-lg p-3 text-white">
          <p className="text-sm">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Dashboard>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
          <p className="text-white/60">Loading your recent applications...</p>
        </div>
      </Dashboard>
    );
  }

  if (error) {
    return (
      <Dashboard>
        <div className="text-center text-red-400 p-8 bg-red-950/20 rounded-xl border border-red-800/30">
          <XCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error Loading Jobs</h3>
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
              Job Applications
            </h1>
            <p className="text-white/60">
              Track and manage your job applications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/applications/new">
              <button className="bg-[var(--buttonbg)] hover:bg-[var(--hoverbtnbg)] cursor-pointer text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Add New
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Based on recent jobs only */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-sm mb-1">Recent Total</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-blue-400/60 text-sm mb-1">Applied</p>
            <p className="text-3xl font-bold text-blue-400">{stats.applied}</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-yellow-400/60 text-sm mb-1">Interview</p>
            <p className="text-3xl font-bold text-yellow-400">
              {stats.interviewing}
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-green-400/60 text-sm mb-1">Offers</p>
            <p className="text-3xl font-bold text-green-400">{stats.offered}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400/60 text-sm mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
          </div>
        </div>

        {/* Charts Section - Based on recent jobs */}
        {recentJobs && recentJobs.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bar Chart - Monthly Applications */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">
                  Recent Monthly Applications
                </h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="applications"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart - Status Distribution */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">
                  Recent Status Distribution
                </h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={statusData.filter((item) => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {statusData
                  .filter((item) => item.value > 0)
                  .map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm text-white/60">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Success Rate Card - Based on recent jobs */}
        {stats.total > 0 && (
          <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-800/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Recent Success Metrics
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-white/40 text-sm">Interview Rate</p>
                <p className="text-2xl font-bold text-white">
                  {((stats.interviewing / stats.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-white/40 text-sm">Offer Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {((stats.offered / stats.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-white/40 text-sm">Rejection Rate</p>
                <p className="text-2xl font-bold text-red-400">
                  {((stats.rejected / stats.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-white/40 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {(
                    ((stats.offered + stats.interviewing) / stats.total) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Jobs Grid/List - Showing all 5 recent jobs */}
        {recentJobs && recentJobs.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-xl font-semibold text-white">
                  {viewMode === "card"
                    ? "Your 5 Most Recent Applications"
                    : "Your 5 Most Recent Applications (List)"}
                </h2>
                <div className="flex items-center justify-between w-1/8">
                  <span className="text-white/60 text-sm mr-3">
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

            {/* Card View - Shows all 5 recent jobs as cards */}
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
                            {job.salaryMin && job.salaryMin}
                            {job.salaryMin && job.salaryMax && " - "}
                            {job.salaryMax && job.salaryMax}
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

            {/* List View - Shows all 5 recent jobs as a table */}
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
                                {job.salaryMin || 0} - {job.salaryMax || 0}
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
          </div>
        ) : (
          <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
            <Briefcase className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Recent Applications
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
    </Dashboard>
  );
}

export default Index;