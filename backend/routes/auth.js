const express = require("express");
const router = express.Router();
const passport = require("passport"); // ✅ ADD
const { verifyToken } = require("../middleware/authMiddleware");
const User = require("../models/User");

/**
 * ============================
 * EXISTING ROUTE (UNCHANGED)
 * ============================
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/**
 * ============================
 * GOOGLE OAUTH ROUTES (ADDED)
 * ============================
 */

/**
 * START GOOGLE LOGIN
 * URL: /api/auth/google
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * GOOGLE CALLBACK
 * URL: /api/auth/google/callback
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      // req.user comes from Google strategy
      const { email, name, googleId } = req.user;

      // OPTIONAL (simple example)
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          username: name,
          email,
          googleId,
        });
      }

      res.json({
        message: "Google login successful",
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Google login failed" });
    }
  }
);

module.exports = router;
