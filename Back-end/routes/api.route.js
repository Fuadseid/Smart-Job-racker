const authRoutes = require("./auth.route");
const { createJob, getAllJobs, getJobById, searchJobs, updateJob, deleteJob } = require("../controllers/job.controller");
const express = require("express");
const router = express.Router();
const { CreateConatctController } = require("../controllers/contact.controller");
const auth = require("../middleware/auth");

router.use("/auth", authRoutes);
router.post("/create-job", createJob);
router.get("/jobs", getAllJobs);
router.get("/jobs/:id", getJobById);
router.get("/search-jobs/:term", searchJobs);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);
router.post("/contact",CreateConatctController);

module.exports = router;
