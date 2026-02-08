
const axios = require('axios');
const { v4: uuidv4 } = require("uuid");
const User = require('../models/User');
const Post = require("../models/Post");
const signRequest = require("../utils/httpSignature");
const fetchInboxUrl = require("../utils/fetchInboxUrl");
const { sendSignedRequest } = require("../utils/sendSignedRequest");

exports.webfinger = async (req, res) => {
  console.log("📡 Webfinger called with:", req.query.resource);

  const resource = req.query.resource;
  const username = resource?.split(":")[1]?.split("@")[0];
  const host = req.headers.host;

  console.log("🔍 Extracted username:", username, "from host:", host);

  const user = await User.findOne({ username });
  if (!user) {
    console.log("❌ User not found:", username);
    return res.status(404).json({ error: "User not found" });
  }

  res.setHeader("Content-Type", "application/activity+json");
  return res.json({
    subject: `acct:${username}@${host}`,
    links: [
      {
        rel: "self",
        type: "application/activity+json",
        href: `${process.env.BASE_URL}/users/${username}`,
      }
    ]
  });
};







// ✅ Actor: Public ActivityPub profile
exports.actor = async (req, res) => {
  const { username } = req.params;
  console.log("👤 Actor requested:", username);

  // Validate username
  if (!username || username === "undefined") {
    console.log("❌ Invalid username:", username);
    return res.status(400).json({ error: "Invalid username" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    console.log("❌ User not found:", username);
    return res.status(404).json({ error: "Not found" });
  }

  console.log("✅ User found:", user.username);

  // Use user-specific public key from database
  const publicKeyPem = user.publicKey;
  if (!publicKeyPem) {
    console.log("❌ Public key not found for user:", username);
    return res.status(500).json({ error: "Public key not configured" });
  }

  res.setHeader("Content-Type", "application/activity+json");
  return res.json({
    "@context": ["https://www.w3.org/ns/activitystreams"],
    id: `${process.env.BASE_URL}/users/${username}`,
    type: "Person",
    preferredUsername: username,
    inbox: `${process.env.BASE_URL}/users/${username}/inbox`,
    outbox: `${process.env.BASE_URL}/users/${username}/outbox`,
    followers: `${process.env.BASE_URL}/users/${username}/followers`,
    following: `${process.env.BASE_URL}/users/${username}/following`,
    publicKey: {
      id: `${process.env.BASE_URL}/users/${username}#main-key`,
      owner: `${process.env.BASE_URL}/users/${username}`,
      publicKeyPem: publicKeyPem,
    },
    icon: {
      type: "Image",
      mediaType: "image/png",
      url: `${process.env.BASE_URL}/images/default-avatar.png`
    }
  });
};







exports.inbox = async (req, res) => {
  const { username } = req.params;
  const activity = req.body;

  console.log("📥 Received activity:", JSON.stringify(activity, null, 2));

  //  Validate activity
  if (!activity || !activity.type) {
    return res.status(400).json({ error: "Invalid or missing activity type" });
  }

  try {
    //Find local user (whose inbox this is)
    const localUser = await User.findOne({ username });
    if (!localUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Handle Follow
    if (activity.type === "Follow") {
      const actor = activity.actor;
      const remoteUsername = actor?.split("/users/")[1];

      console.log(`Follow request from: ${remoteUsername}`);

      if (!localUser.followers.includes(actor)) {
        localUser.followers.push(actor);
        await localUser.save();
        console.log(` Added ${actor} to followers of ${username}`);
      }

      // Send Accept
      const acceptActivity = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Accept",
        actor: `${process.env.DOMAIN}/users/${localUser.username}`,
        object: activity,
      };

      const inboxUrl = `${actor}/inbox`;

      try {
        await sendSignedRequest(localUser.username, inboxUrl, acceptActivity);
        console.log("Sent Accept back to:", inboxUrl);
      } catch (err) {
        console.error(` Failed to send Accept to ${inboxUrl}:`, err.message);
      }

      return res.sendStatus(202);
    }

    // Handle Create (posts)
    if (activity.type === "Create") {
      const object = activity.object;

      if (!object || object.type !== "Note") {
        console.log("Not a Note object, skipping.");
        return res.sendStatus(202);
      }

      // Avoid duplicate posts
      const existing = await Post.findOne({ activityId: object.id });
      if (existing) {
        console.log(" Duplicate post, skipping.");
        return res.sendStatus(202);
      }

      const content = object.content || "";
      const image = object.attachment?.[0]?.url || null;

      const newPost = new Post({
        actor: object.attributedTo || activity.actor,
        imageUrl: image,
        caption: content.replace(/<\/?[^>]+(>|$)/g, ""), // Strip HTML tags
        to: object.to || [],
        activityId: object.id,
        inReplyTo: object.inReplyTo || null,
        remote: true
      });

      await newPost.save();
      console.log(`Saved remote post from ${object.attributedTo || activity.actor}`);
      return res.sendStatus(201);
    }

    // Handle other types as needed
    console.log(`ℹUnhandled activity type: ${activity.type}`);
    return res.sendStatus(202);

  } catch (err) {
    console.error(" Inbox handler error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




















exports.getFollowers = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user) return res.status(404).json({ error: "User not found" });

  // Remove trailing '/inbox' if present
  const cleanedFollowers = user.followers.map(url =>
    url.replace(/\/inbox$/, "")
  );

  res.json({
    "@context": "https://www.w3.org/ns/activitystreams",
    type: "OrderedCollection",
    totalItems: cleanedFollowers.length,
    items: cleanedFollowers
  });
};




exports.getFollowing = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    "@context": "https://www.w3.org/ns/activitystreams",
    type: "OrderedCollection",
    totalItems: user.following.length,
    items: user.following
  });
};






// DELETE a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Only allow deletion if the logged-in user is the author
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: "Failed to delete post" });
  }
};



exports.outbox = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });

    const activities = posts.map((post) => ({
      "@context": "https://www.w3.org/ns/activitystreams",
      id: `${process.env.DOMAIN}/posts/${post._id}`,
      type: "Create",
      actor: `${process.env.DOMAIN}/users/${username}`,
      published: post.createdAt,
      to: ["https://www.w3.org/ns/activitystreams#Public"],
      cc: [],
      object: {
        id: `${process.env.DOMAIN}/posts/${post._id}`,
        type: "Note",
        attributedTo: `${process.env.DOMAIN}/users/${username}`,
        content: post.caption,
        published: post.createdAt,
        to: ["https://www.w3.org/ns/activitystreams#Public"],
        attachment: post.imageUrl
          ? [
            {
              type: "Image",
              mediaType: "image/jpeg",
              url: post.imageUrl,
            },
          ]
          : [],
      },
    }));

    const outbox = {
      "@context": "https://www.w3.org/ns/activitystreams",
      type: "OrderedCollection",
      totalItems: activities.length,
      orderedItems: activities,
    };

    res.json(outbox);
  } catch (err) {
    console.error("Outbox error:", err);
    res.status(500).json({ error: "Failed to get outbox" });
  }
};
