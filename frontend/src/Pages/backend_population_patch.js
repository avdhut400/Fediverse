// Feed controller query example:
// The author must include profilePic, otherwise FeedPage cannot show it after refresh.

const posts = await Post.find(query)
  .populate("author", "username displayName profilePic")
  .sort({ createdAt: -1 });

// Comment query example:
const comments = await Comment.find({ post: req.params.postId })
  .populate("user", "username displayName profilePic")
  .populate("author", "username displayName profilePic")
  .sort({ createdAt: 1 });
