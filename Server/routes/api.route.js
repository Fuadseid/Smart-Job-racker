const authRoutes = require("./auth.route");
const {
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
  getisSavedJob,
  getInterviewedJob,
  getOfferJob,
  getDashboardStats
} = require("../controllers/job.controller");
const express = require("express");
const upload = require('../middleware/upload');

const router = express.Router();
const {
  CreateConatctController,
} = require("../controllers/contact.controller");
const auth = require("../middleware/auth");
const { analyzeResume } = require("../controllers/resumeController");

router.use("/auth", authRoutes);
router.post("/create-job",auth, createJob);
router.get("/jobs",auth, getAllJobs);
router.get("/jobs/interviewed",auth,getInterviewedJob);
router.get("/dashboard-stats",auth,getDashboardStats);
router.get("/jobs/offered",auth,getOfferJob);
router.post('/analyze', upload.single('resume'), analyzeResume);
router.post("/save-job",auth,saveJobController),
router.delete("/unsave-job/:id",auth,unSavedJobController)
router.get("/get-all-saved",auth,getSavedJob)
router.post("/get-is-saved",auth,getisSavedJob)
router.get("/jobs/:id", getJobById);
router.get("/search-jobs/:term", searchJobs);
router.put("/jobs/:id", updateJob);
router.get("/recent-job", getRecentJob);
router.delete("/jobs/:id", deleteJob);
router.post("/contact", CreateConatctController);

module.exports = router;
  