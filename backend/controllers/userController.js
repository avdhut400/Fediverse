


// controllers/userController.js

const axios = require("axios");
const User = require("../models/User");
const Post = require("../models/Post");
const signRequest = require("../utils/httpSignature");


// controllers/userController.js
exports.getAllUsers = async (req, res) => {
  const currentUsername = req.query.currentUser;

  try {
    const users = await User.find({ username: { $ne: currentUsername } }).select("username displayName");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};






exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};




exports.followUser = async (req, res) => {
  const targetUsername = req.params.username;
  const currentUserId = req.user.id;

  try {
    const targetUser = await User.findOne({ username: targetUsername });
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUsername = currentUser.username;

    //  Add to following list
    if (!currentUser.following.includes(targetUser.actorUrl)) {
      currentUser.following.push(targetUser.actorUrl);
      await currentUser.save();
    }

    // Add to followers list
    if (!targetUser.followers.includes(currentUser.actorUrl)) {
      targetUser.followers.push(currentUser.actorUrl);
      await targetUser.save();
    }

    res.status(200).json({ message: "Followed successfully" });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ error: "Failed to follow user" });
  }
};







exports.unfollowUser = async (req, res) => {
  const targetUsername = req.params.username;
  const currentUserId = req.user.id;

  try {
    const targetUser = await User.findOne({ username: targetUsername });
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentActor = currentUser.actorUrl;
    const targetActor = targetUser.actorUrl;

    // Remove from following
    currentUser.following = currentUser.following.filter(
      (actor) => actor !== targetActor
    );
    await currentUser.save();

    // Remove from followers
    targetUser.followers = targetUser.followers.filter(
      (actor) => actor !== currentActor
    );
    await targetUser.save();

    // If target is remote, send Undo Follow
    if (targetActor.startsWith("http") && !targetActor.includes(process.env.BASE_URL)) {
      const undoActivity = {
        "@context": "https://www.w3.org/ns/activitystreams",
        id: `${currentActor}/undo/${crypto.randomUUID()}`,
        type: "Undo",
        actor: currentActor,
        object: {
          type: "Follow",
          actor: currentActor,
          object: targetActor
        }
      };

      const inboxUrl = targetActor + "/inbox";

      const headers = await signRequest({
        actor: currentActor,
        inboxUrl,
        body: undoActivity,
        username: currentUser.username
      });

      await axios.post(inboxUrl, undoActivity, { headers });
      console.log(`Sent Undo follow to ${inboxUrl}`);
    }

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow error:", err.message);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
};







exports.getUserPosts = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user) return res.status(404).json({ error: "User not found" });

  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .populate("author", "username");

  res.json(posts);
};


