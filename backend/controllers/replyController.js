// const Reply = require("../models/Reply");
// const Post = require("../models/Post");

// exports.createReply = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { caption } = req.body;
//     const user = req.user;

//     const post = await Post.findById(postId);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const reply = new Reply({
//       post: post._id,
//       caption,
//       author: user._id,
//       actor: `${process.env.BASE_URL}/users/${user.username}`,
//       to: [post.actor || `${process.env.BASE_URL}/users/${post.author}`],
//       activityId: `${process.env.BASE_URL}/replies/${post._id}/activity/${new Date().getTime()}`
//     });

//     await reply.save();

//     return res.status(201).json({ message: "Reply created", reply });
//   } catch (err) {
//     console.error("❌ Reply creation failed:", err.message);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getRepliesForPost = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const replies = await Reply.find({ post: postId }).sort({ createdAt: -1 }).populate("author", "username");
//     return res.status(200).json(replies);
//   } catch (err) {
//     console.error("❌ Get replies failed:", err.message);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
