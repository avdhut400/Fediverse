const express = require("express");
const router = express.Router();
const { sendFollow,sendUnfollow ,removeRemoteFollower} = require("../controllers/followController");
const { verifyToken } = require("../middleware/authMiddleware");
router.post("/users/:username/follow", sendFollow); // Remote actors
router.post("/remote/:username/follow", sendFollow); 
router.delete(
  "/:username/remote-follower",
  verifyToken,
  removeRemoteFollower
);




router.delete(
  "/:username/remote-unfollow",
  verifyToken,
  sendUnfollow
);

module.exports = router;

