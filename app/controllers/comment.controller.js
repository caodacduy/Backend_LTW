const db = require('../models');
const Comment = db.Comment;
const Post = db.Post;
const User = db.User;

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { post_id, content , parent_id} = req.body;
    const user_id = req.user.id
    // Kiểm tra post và user tồn tại
    const post = await Post.findByPk(post_id);
    if (!post ) {
      return res.status(400).json({status:"error", message: 'Invalid post_id or user_id' });
    }

    const comment_parent = await Comment.findByPk(parent_id);
    console.log(comment_parent)
    if (!comment_parent) {
      return res.status(400).json({
        status:"error",
        message:"Khong tra loi duoc coment"
      })
    }

    const comment = await Comment.create({ post_id, user_id, parent_id, content , name:req.user.name});
    res.status(201).json({
        status:"success",
        comment
    }
        );
  } catch (error) {
    res.status(500).json({ status:"error", message: 'Error creating comment', error: error.message });
  }
};


// Get all comments of a post (optional: include replies)
const getNestedReplies = async (comment) => {
  const replies = await Comment.findAll({
    where: { parent_id: comment.id },
    include: [{ model: db.User, attributes: ['id', 'name'] }],
    order: [['created_at', 'ASC']]
  });

  for (const reply of replies) {
    reply.dataValues.Replies = await getNestedReplies(reply); // Đệ quy
  }

  return replies;
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { post_id } = req.params;

    // Lấy các bình luận gốc (parent_id null)
    const rootComments = await Comment.findAll({
      where: { post_id: post_id, parent_id: null },
      include: [{ model: db.User, attributes: ['id', 'name'] }],
      order: [['created_at', 'ASC']]
    });

    // Với mỗi bình luận gốc, lấy các phản hồi con
    for (const comment of rootComments) {
      comment.dataValues.Replies = await getNestedReplies(comment);
    }

    res.json({ status: "success", comments: rootComments });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: 'Error fetching comments',
      error: error.message
    });
  }
};




// // Delete a comment (and its replies via ON DELETE CASCADE)
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.Comment.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};
