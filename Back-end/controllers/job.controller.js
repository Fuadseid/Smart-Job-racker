const jobservice = require("../services/job.service");

const createJob = async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = await jobservice.createJob(jobData);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobservice.getAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getRecentJob = async (req, res) => {
  try {
    const recentJobs = await jobservice.getRecentJobs();

    res.status(200).json({
      success: true,
      count: recentJobs.length,
      data: recentJobs,
    });
  } catch (error) {
    console.error("Error fetching recent jobs:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent jobs",
      error: error.message,
    });
  }
};
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await jobservice.getJobById(jobId);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const searchJobs = async (req, res) => {
  try {
    const { term } = req.params;
    const jobs = await jobservice.searchjobs(term);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const jobData = req.body;
    const updatedJob = await jobservice.updateJob(jobId, jobData);
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    await jobservice.deleteJob(jobId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const saveJobController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;

    const result = await jobservice.saveJobs(jobId, userId);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unSavedJobController = async (req, res) => {
  const savedId = req.params.id;

  const result = await jobservice.unsaveJob(savedId);

  res.status(200).json(result);
};
const getSavedJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await jobservice.getSavedJobs(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  searchJobs,
  updateJob,
  deleteJob,
  getRecentJob,
  getSavedJob,
  unSavedJobController,
  saveJobController,
};
