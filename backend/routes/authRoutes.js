const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post("/register", authController.register);
router.post("/login", authController.login);

// GET /me - Get current authenticated user (Issue #9: consolidated from auth.js)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// DELETE /posts/:postId
router.delete("/posts/:postId", verifyToken, authController.deletePost);

module.exports = router;
