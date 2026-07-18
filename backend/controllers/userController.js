


// controllers/userController.js

const axios = require("axios");
const User = require("../models/User");
const Post = require("../models/Post");
const signRequest = require("../utils/httpSignature");


// controllers/userController.js
exports.getAllUsers = async (req, res) => {
  // const currentUsername = req.query.currentUser;
  const currentUsername = req.params.username; 
  

  try {
    const users = await User.find({ username: { $ne: currentUsername } }).select("username profilePic");
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

      const headers = signRequest({
        actor: currentActor,
        inboxUrl,
        body: undoActivity
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


exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const user = await User.findById(userId).select(
      "-password -privateKey"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Failed to load profile", 
    });
  }
};

// /*
//  * SET or UPDATE profile picture
//  */

exports.updateProfilePicture = async (req, res) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message:
          "Profile picture was not received",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.profilePic = {
      url: req.file.path,
      filename: req.file.filename,
    };

    await user.save();

    return res.status(200).json({
      message:
        "Profile picture updated successfully",
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error(
      "Profile update error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to update profile picture",
    });
  }
};
// /*
//  * REMOVE profile picture
//  */

exports.removeProfilePicture = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.profilePic?.filename) {
      try {
        await cloudinary.uploader.destroy(
          user.profilePic.filename
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary image deletion failed:",
          cloudinaryError
        );
      }
    }

    user.profilePic = {
      url: "",
      filename: "",
    };

    await user.save();

    return res.status(200).json({
      message: "Profile picture removed successfully",
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Remove profile picture error:", error);

    return res.status(500).json({
      message: "Failed to remove profile picture",
    });
  }
};









exports.updateBio = async (req, res) => {
  try {
    const userId = (
      req.user?.id ||
      req.user?._id
    )?.toString();

    const { bio } = req.body;

    if (typeof bio !== "string") {
      return res.status(400).json({
        error: "Bio must be a string.",
      });
    }

    if (bio.trim().length > 160) {
      return res.status(400).json({
        error: "Bio cannot exceed 160 characters.",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        bio: bio.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -privateKey");

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    return res.status(200).json({
      message: "Bio updated successfully.",
      user,
    });
  } catch (err) {
    console.error("Error updating bio:", err);

    return res.status(500).json({
      error: "Server error.",
    });
  }
};















// module.exports = {
//   updateProfilePicture,
//   removeProfilePicture
// };
