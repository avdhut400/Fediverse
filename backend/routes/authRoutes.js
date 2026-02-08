const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
// DELETE /posts/:postId
router.delete("/posts/:postId", verifyToken, authController.deletePost);

/**
 * GOOGLE OAUTH ROUTES
 */

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/error" }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Redirect to frontend with token
      const redirectUrl = `http://localhost:3000?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user._id, username: user.username, email: user.email }))}`;
      res.redirect(redirectUrl);
    } catch (err) {
      console.error("Google login error:", err);
      res.redirect("http://localhost:3000?error=google_login_failed");
    }
  }
);

// Error handler
router.get("/google/error", (req, res) => {
  res.redirect("http://localhost:3000?error=google_auth_failed");
});

module.exports = router;
