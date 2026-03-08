const mongoose = require("mongoose");
const job = require("../models/job.models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const user = require("../models/user.model");
const savedJobModels = require("../models/savedJob.models");
const createJob = async (jobData, userid) => {
  try {
    const userId = await user.findById(userid);
    if (!userId) {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        "User ID is must be valid to post a job",
      );
    }
    const newJob = await job.create({
      ...jobData,
      userId: userid,
    });
    return newJob;
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Failed to create job: ${error.message}`,
    );
  }
};
const getAllJobs = async (userId) => {
  try {
    const jobs = await job.find({
      userId: userId,
    });
    return jobs;
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      "Failed to fetch jobs",
    );
  }
};
const getJobById = async (jobId) => {
  try {
    const jobbyid = await job.findById(jobId);
    if (!jobbyid) {
      throw new ApiError(httpStatus.status.NOT_FOUND, "Job not found");
    }
    return jobbyid;
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Failed to fetch job: ${error.message}`,
    );
  }
};

const searchjobs = async (term) => {
  const filter = {
    $or: [
      { position: { $regex: term, $options: "i" } },
      { companyName: { $regex: term, $options: "i" } },
      { location: { $regex: term, $options: "i" } },
    ],
  };

  const jobs = await job.find(filter);
  return jobs;
};
const getRecentJobs = async () => {
  try {
    const recentJobs = await job.find().sort({ createdAt: -1 }).limit(5);

    console.log("5 most recent jobs:", recentJobs);
    return recentJobs;
  } catch (error) {
    console.error("Error fetching recent jobs:", error);
    throw error;
  }
};
const updateJob = async (jobId, jobData) => {
  try {
    const UpdatedJob = await job.findByIdAndUpdate(jobId, jobData, {
      new: true,
    });
    if (!UpdatedJob) {
      throw new ApiError(httpStatus.status.NOT_FOUND, "Job not found");
    }
    return UpdatedJob;
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      "Failed to update job",
    );
  }
};
const saveJobs = async (jobId, userId) => {
  try {
    const jobcreatedbyuser = await job.find({
      _id:jobId,
      userId: userId, 
    });
    if (!jobcreatedbyuser) {
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        "Job is not belongs to user",
      );
    } else {
      const existing = savedJobModels.findOne({
        userId: userId,
        jobId: jobId,
      });
      if (!existing) {
        return {
          success: false,
          message: "Job already saved",
        };
      }
      const saved = await savedJobModels.create({
        userId: userId,
        jobId: jobId,
      });
      return {
        success: true,
        data: saved,
      };
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `error: ${error}`,
    );
  }
};
const unsaveJob = async (saved_id) => {
  const deleted = await savedJobModels.findByIdAndDelete(saved_id);

  if (!deleted) {
    return {
      success: false,
      message: "Saved job not found",
    };
  }

  return {
    success: true,
  };
};
const deleteJob = async (jobId) => {
  try {
    const deletedJob = await job.findByIdAndDelete(jobId);
    if (!deletedJob) {
      throw new ApiError(httpStatus.status.NOT_FOUND, "Job not found");
    }
    return;
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      "Failed to delete job",
    );
  }
};
const getSavedJobs = async (userId) => {
  try {
    const savedJobs = await savedJobModels
      .find({ userId })
      .populate({ path: "jobId", match: { userId: userId } })
      .sort({ createdAt: -1 });

    return savedJobs;
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `error: ${error}`,
    );
  }
};
const getSavedJob = async (jobId, userId) => {
  try {
    const savedJob = await savedJobModels.findOne({
      jobId: jobId,
      userId: userId,
    });
    return savedJob;
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `error: ${error}`,
    );
  }
};
const InterviewedJobs = async (userId) => {
  try {
    const interviewedJobs = await job.find({
      userId: userId,
      status: "interview",
    });
    return interviewedJobs
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `error: ${error}`,
    );
  }
};
const OfferJobs = async (userId) => {
  try {
    const interviewedJobs = await job.find({
      userId: userId,
      status: "offer",
    });
    return interviewedJobs
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `error: ${error}`,
    );
  }
};
const getDashboardStats = async (userId) => {
  try {
    // Convert userId to ObjectId for aggregation
    const objectId = new mongoose.Types.ObjectId(userId);
    
    // Get total jobs count
    const totalJobs = await job.countDocuments({ userId: objectId });

    // Get counts by status for pie chart/status distribution
    const statusCounts = await job.aggregate([
      { $match: { userId: objectId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format status counts for easy access
    const statusStats = {
      saved: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0
    };

    // Map the aggregation results to statusStats
    statusCounts.forEach(item => {
      if (item._id && statusStats.hasOwnProperty(item._id)) {
        statusStats[item._id] = item.count;
      }
    });

    // Get jobs applied over time (last 30 days) for line chart
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const jobsOverTime = await job.aggregate([
      {
        $match: {
          userId: objectId,
          appliedDate: { $exists: true, $ne: null },
          appliedDate: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$appliedDate" },
            month: { $month: "$appliedDate" },
            day: { $dayOfMonth: "$appliedDate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    // Format jobs over time for chart
    const appliedJobsTimeline = jobsOverTime.map(item => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
      count: item.count
    }));

    // Get saved jobs count
    const savedJobsCount = await savedJobModels.countDocuments({ userId: objectId });

    // Get recent activity (last 5 jobs)
    const recentJobs = await job.find({ userId: objectId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('companyName position status updatedAt appliedDate');

    // Calculate success rates based on actual data
    const totalApplied = statusStats.applied + statusStats.interview + statusStats.offer + statusStats.rejected;
    const successRate = totalApplied > 0 
      ? Math.round((statusStats.offer / totalApplied) * 100) 
      : 0;
    const interviewRate = totalApplied > 0 
      ? Math.round((statusStats.interview / totalApplied) * 100) 
      : 0;
    const offerRate = totalApplied > 0 
      ? Math.round((statusStats.offer / totalApplied) * 100) 
      : 0;

    // Get applied this month
    const appliedThisMonth = await getAppliedThisMonth(objectId);

    // Get monthly application trends (last 6 months) - FIXED VERSION
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // First, get all jobs from last 6 months (including those without appliedDate)
    const allJobsLast6Months = await job.find({
      userId: objectId,
      createdAt: { $gte: sixMonthsAgo } // Use createdAt instead of appliedDate
    });

    // Create a map to aggregate by month
    const monthlyMap = new Map();

    allJobsLast6Months.forEach(job => {
      const date = job.appliedDate || job.createdAt; // Use appliedDate if available, otherwise createdAt
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const monthKey = `${year}-${month}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          year,
          month,
          applied: 0,
          interviews: 0,
          offers: 0
        });
      }
      
      const monthData = monthlyMap.get(monthKey);
      
      // Count by status
      if (job.status === 'applied' || job.status === 'Applied') {
        monthData.applied += 1;
      } else if (job.status === 'interview' || job.status === 'Interview') {
        monthData.interviews += 1;
      } else if (job.status === 'offer' || job.status === 'Offer') {
        monthData.offers += 1;
      }
    });

    // Convert map to array and format for response
    const monthlyData = Array.from(monthlyMap.values())
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .map(item => {
        const date = new Date(item.year, item.month - 1, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        return {
          month: `${monthName} ${item.year}`,
          applied: item.applied,
          interviews: item.interviews,
          offers: item.offers
        };
      });

    // Alternative aggregation approach if you prefer using aggregate
    const monthlyTrendsAggregate = await job.aggregate([
      {
        $match: {
          userId: objectId,
          createdAt: { $gte: sixMonthsAgo } // Use createdAt instead of appliedDate
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          applied: {
            $sum: { 
              $cond: [{ 
                $or: [
                  { $eq: ["$status", "applied"] },
                  { $eq: ["$status", "Applied"] }
                ] 
              }, 1, 0] 
            }
          },
          interviews: {
            $sum: { 
              $cond: [{ 
                $or: [
                  { $eq: ["$status", "interview"] },
                  { $eq: ["$status", "Interview"] }
                ] 
              }, 1, 0] 
            }
          },
          offers: {
            $sum: { 
              $cond: [{ 
                $or: [
                  { $eq: ["$status", "offer"] },
                  { $eq: ["$status", "Offer"] }
                ] 
              }, 1, 0] 
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format the aggregate results
    const monthlyDataFromAggregate = monthlyTrendsAggregate.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      return {
        month: `${monthName} ${item._id.year}`,
        applied: item.applied,
        interviews: item.interviews,
        offers: item.offers
      };
    });

    // Use whichever approach you prefer
    const finalMonthlyData = monthlyDataFromAggregate.length > 0 ? monthlyDataFromAggregate : monthlyData;

    // Get source distribution
    const sourceDistribution = await job.aggregate([
      { $match: { userId: objectId } },
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 }
        }
      }
    ]);

    const sourceStats = {};
    sourceDistribution.forEach(item => {
      sourceStats[item._id] = item.count;
    });

    // Get upcoming follow-ups
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingFollowUps = await job.find({
      userId: objectId,
      followUpDate: { 
        $gte: today, 
        $lte: nextWeek 
      }
    })
    .sort({ followUpDate: 1 })
    .select('companyName position followUpDate');

    // Create status pie data from actual statusStats
    const statusPieData = [
      { name: 'Saved', value: statusStats.saved || 0, color: '#8B5CF6' },
      { name: 'Applied', value: statusStats.applied || 0, color: '#3B82F6' },
      { name: 'Interview', value: statusStats.interview || 0, color: '#F59E0B' },
      { name: 'Offer', value: statusStats.offer || 0, color: '#10B981' },
      { name: 'Rejected', value: statusStats.rejected || 0, color: '#EF4444' }
    ].filter(item => item.value > 0);

    // Create source pie data
    const sourcePieData = [
      { name: 'Manual', value: sourceStats.manual || 0, color: '#8884d8' },
      { name: 'Chrome Extension', value: sourceStats['chrome-extension'] || 0, color: '#82ca9d' },
      { name: 'Email', value: sourceStats.email || 0, color: '#ffc658' }
    ].filter(item => item.value > 0);

    // Compile all dashboard statistics
    const dashboardStats = {
      overview: {
        totalJobs,
        savedJobs: statusStats.saved,
        activeApplications: statusStats.applied,
        interviews: statusStats.interview,
        offers: statusStats.offer,
        rejected: statusStats.rejected,
        savedJobsCount,
        successRate,
        appliedThisMonth,
        interviewRate,
        offerRate
      },
      statusDistribution: statusStats,
      sourceDistribution: sourceStats,
      recentActivity: recentJobs,
      upcomingFollowUps,
      charts: {
        statusPieData,
        timelineData: appliedJobsTimeline,
        monthlyTrendsData: finalMonthlyData, // Use the fixed monthly data
        sourcePieData
      },
      graphs: {
        applicationTrend: {
          labels: appliedJobsTimeline.map(item => item.date),
          datasets: [
            {
              label: 'Applied',
              data: appliedJobsTimeline.map(item => item.count),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4
            }
          ]
        },
        statusGraph: {
          labels: statusPieData.map(item => item.name),
          datasets: [
            {
              data: statusPieData.map(item => item.value),
              backgroundColor: statusPieData.map(item => item.color),
              borderWidth: 1
            }
          ]
        }
      }
    };

    return dashboardStats;
  } catch (error) {
    console.error("Dashboard stats error:", error);
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Failed to get dashboard stats: ${error.message}`
    );
  }
};

// Helper function to get applications from current month
const getAppliedThisMonth = async (userId) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  return await job.countDocuments({
    userId: userId,
    $or: [
      { appliedDate: { $gte: startOfMonth, $lte: endOfMonth } },
      { createdAt: { $gte: startOfMonth, $lte: endOfMonth } }
    ]
  });
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  searchjobs,
  updateJob,
  deleteJob,
  getRecentJobs,
  saveJobs,
  unsaveJob,
  getSavedJobs,
  getSavedJob,
  InterviewedJobs,
  OfferJobs,
  getDashboardStats
};
