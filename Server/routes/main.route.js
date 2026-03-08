const authroute = require('./api.route')

const express = require("express");
const router = express.Router();

router.use("/api",authroute);

module.exports = router;