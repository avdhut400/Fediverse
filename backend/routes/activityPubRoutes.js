
const express = require("express");
const router = express.Router();
const {
  webfinger,
  actor,
  inbox,
  outbox,
  getFollowers,
  getFollowing,
  deletePost,

} = require("../controllers/activityPubController");

const { verifyToken } = require("../middleware/authMiddleware");

// WebFinger route
router.get('/webfinger', webfinger);

// ActivityPub actor/inbox/outbox routes
router.get('/:username', actor);
router.post('/:username/inbox', inbox);
router.get('/:username/outbox',  outbox); 
router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);
router.get('/:username/inbox', inbox);
// DELETE a post (only for owner)
router.delete('/:id', verifyToken, deletePost);




module.exports = router;

