const express = require("express");
const { register, login, refreshtoken } = require("../controllers/auth.controller");
const passport = require("passport");
const TokenService = require("../services/token.service");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/refresh',auth,refreshtoken)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const tokens = await TokenService.generateAuthToken(req.user.id);
    res.json({ user: req.user, tokens });
  },
);

module.exports = router;
