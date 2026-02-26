const job = require("../models/job.models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const user = require("../models/user.model");
const createJob = async (jobData) => {
  try {
    const userId = await user.findById(jobData.userId);
    if (!userId) {
      throw new ApiError(
        httpStatus.status.BAD_REQUEST,
        "User ID is must be valid to post a job",
      );
    }
    const newJob = await job.create(jobData);
    return newJob;
  } catch (error) {
    throw new ApiError(
      httpStatus.status.INTERNAL_SERVER_ERROR,
      `Failed to create job: ${error.message}`,
    );
  }
};
const getAllJobs = async () => {
  try {
    const jobs = await job.find();
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
    const recentJobs = await job.find()
      .sort({ createdAt: -1 }) 
      .limit(5); 

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

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  searchjobs,
  updateJob,
  deleteJob,
  getRecentJobs
};
