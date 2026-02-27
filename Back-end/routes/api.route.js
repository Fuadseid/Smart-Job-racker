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
} = require("../controllers/job.controller");
const express = require("express");
const router = express.Router();
const {
  CreateConatctController,
} = require("../controllers/contact.controller");
const auth = require("../middleware/auth");

router.use("/auth", authRoutes);
router.post("/create-job", createJob);
router.get("/jobs", getAllJobs);
router.post("/save-job",auth,saveJobController),
router.delete("/unsave-job/:id",auth,unSavedJobController)
router.get("/get-all-saved",auth,getSavedJob)
router.get("/jobs/:id", getJobById);
router.get("/search-jobs/:term", searchJobs);
router.put("/jobs/:id", updateJob);
router.get("/recent-job", getRecentJob);
router.delete("/jobs/:id", deleteJob);
router.post("/contact", CreateConatctController);

module.exports = router;
