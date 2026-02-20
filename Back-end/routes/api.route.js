const authRoutes = require("./auth.route");
const { createJob, getAllJobs, getJobById, searchJobs, updateJob, deleteJob } = require("../controllers/job.controller");
const express = require("express");
const router = express.Router();

router.use("/auth", authRoutes);
router.post("/create-job", createJob);
router.get("/jobs", getAllJobs);
router.get("/jobs/:id", getJobById);
router.get("/search-jobs/:term", searchJobs);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);

module.exports = router;
