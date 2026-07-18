const Comment = require('../models/Reply');
const User = require('../models/User');

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: 'Comment content is required.' });
    }

    // Fetch username of the logged-in user
    const user = await User.findById(userId).select('username');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const comment = new Comment({
      post: postId,
      author: userId,
      username: user.username, // store username in DB
      content,
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error('❌ Error creating comment:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 }); // no need to populate anymore

    res.json(comments);
  } catch (err) {
    console.error('❌ Error fetching comments:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};



// exports.deleteComment = async (req, res) => {
//   try {
//     const commentId = req.params.commentId;
//     const userId = req.user.id;

//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       return res.status(404).json({ error: "Comment not found." });
//     }

//     if (comment.author.toString() !== userId) {
//       return res.status(403).json({
//         error: "You are not authorized to delete this comment.",
//       });
//     }

//     await comment.deleteOne();

//     return res.status(200).json({
//       message: "Comment deleted successfully.",
//     });
//   } catch (err) {
//     console.error("❌ Error deleting comment:", err.message);

//     return res.status(500).json({
//       error: "Server error",
//     });
//   }
// };



exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const userId = (
      req.user?.id ||
      req.user?._id
    )?.toString();

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found.",
      });
    }

    if (comment.post?.toString() !== postId) {
      return res.status(400).json({
        error: "Comment does not belong to this post.",
      });
    }

    const commentAuthorId = (
      comment.author?._id ||
      comment.author
    )?.toString();

    if (commentAuthorId !== userId) {
      return res.status(403).json({
        error: "You are not authorized to delete this comment.",
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      message: "Comment deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Error deleting comment:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
};







exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: "Comment content is required.",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found.",
      });
    }

    const userId = (
      req.user.id ||
      req.user._id
    ).toString();

    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        error: "You are not authorized to edit this comment.",
      });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    console.error("❌ Error updating comment:", err);

    return res.status(500).json({
      error: "Server error",
    });
  }
};