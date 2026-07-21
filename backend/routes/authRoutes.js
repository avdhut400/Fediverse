const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {verifyToken} =require("../middleware/authMiddleware");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
router.post("/register", authController.register);
router.post("/login", authController.login);


router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
// DELETE /posts/:postId
router.delete("/posts/:postId", verifyToken, authController.deletePost);

module.exports = router;
