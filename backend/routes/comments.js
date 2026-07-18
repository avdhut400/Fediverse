const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authenticate'); // make sure this sets req.user




console.log("typeof authMiddleware:", typeof authMiddleware);
console.log("typeof createComment:", typeof commentController.createComment);
console.log("typeof getCommentsByPost:", typeof commentController.getCommentsByPost);

router.post('/:postId/comment', authMiddleware, commentController.createComment);
router.get('/:postId/comment', commentController.getCommentsByPost);
router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  commentController.deleteComment
);

router.put(
  "/:commentId",
  authMiddleware,
  commentController.updateComment
);

module.exports = router;
