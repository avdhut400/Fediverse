
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");


exports.getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const feedPosts = [];
    const localFollowing = [];
    const remoteFollowing = [];

    // Process following list
    for (const actorUrl of user.following) {
      try {
        // Check if this is a local user
        if (actorUrl.includes(process.env.API_BASE_URL)) {
          // Extract username from URL (handle different URL formats)
          const urlParts = actorUrl.split('/');
          const username = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
          
          const localUser = await User.findOne({ username });
          if (localUser) {
            localFollowing.push(localUser._id);
          } else {
            console.log(`Local user not found: ${username}`);
          }
        } else {
          remoteFollowing.push(actorUrl);
        }
      } catch (err) {
        console.error(`Error processing following entry: ${actorUrl}`, err);
      }
    }

    // Get local posts with proper population
    if (localFollowing.length > 0) {
      const localPosts = await Post.find({ author: { $in: localFollowing } })
        .sort({ createdAt: -1 })
        .populate({
          path: 'author',
          select: 'username displayName avatar profilePic bio',
          model: 'User'
        })
        .lean(); // Convert to plain JS objects

      console.log(`Found ${localPosts.length} local posts`); // Debug log
      feedPosts.push(...localPosts);
    }

    // Get remote posts (your existing code works fine)
    for (const remoteActorUrl of remoteFollowing) {
      try {
        const outboxUrl = `${remoteActorUrl}/outbox`;
        const response = await axios.get(outboxUrl, {
          headers: { 
            Accept: "application/activity+json",
            "ngrok-skip-browser-warning": "true" 
          },
        });
        
        const remoteItems = response.data?.orderedItems || [];
        console.log(`Found ${remoteItems.length} remote items from ${remoteActorUrl}`);

        for (const activity of remoteItems) {
          if (activity.type === "Create" && activity.object?.type === "Image") {
            const post = {
              _id: activity.object.id,
              content: activity.object.name || "",
              image: activity.object.url,
              author: {
                username: remoteActorUrl.split("/users/")[1],
                displayName: activity.object.attributedTo,
              },
              createdAt: activity.published,
              remote: true,
            };
            feedPosts.push(post);
          }
        }
      } catch (err) {
        console.error(`Failed to fetch remote posts from ${remoteActorUrl}:`, err.message);
      }
    }

    // Sort all posts by date (newest first)
    feedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(feedPosts);
  } catch (err) {
    console.error("Feed fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};