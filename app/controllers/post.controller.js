const db = require('../models/index');
const Post = db.Post;
const Tag = db.Tag;

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    let { title, content, tags } = req.body;

    if (!title) {
      throw new Error('Thiếu dữ liệu bắt buộc');
    }

    // Tách chuỗi tags thành mảng nếu tags là chuỗi
    if (typeof tags === 'string') {
      // Giả sử tags cách nhau bằng dấu cách, có thể thay đổi dấu phân cách nếu cần
      tags = tags.trim().split(/\s+/); 
    } else if (!Array.isArray(tags)) {
      // Nếu không phải chuỗi hoặc mảng thì gán rỗng
      tags = [];
    }

    // Lấy file từ req.files
    const image = req.files && req.files['image'] ? req.files['image'][0] : null;
    const file = req.files && req.files['file'] ? req.files['file'][0] : null;

    const imageUrl = image ? `/uploads/image/${image.filename}` : null;
    const fileUrl = file ? `/uploads/file/${file.filename}` : null;

    const newPost = await Post.create({
      title,
      content,
      user_id: userId,
      image_url: imageUrl,
      file_url: fileUrl
    });

    if (tags.length > 0) {
      const tagInstances = [];
      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName.trim() }
        });
        tagInstances.push(tag);
      }
      await newPost.addTags(tagInstances);
    }

    const postWithTags = await Post.findByPk(newPost.id, {
      include: [{ model: Tag, through: { attributes: [] } }]
    });

    return res.status(201).json({
      status: 'success',
      data: postWithTags
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi tạo bài viết'
    });
  }
};


exports.createPostInGroup = async (req, res) => {
  try {
    const { group_id } = req.params;
    const userId = req.user.id;
    let { title, content, tags } = req.body;

    const image = req.files && req.files['image'] ? req.files['image'][0] : null;
    const file = req.files && req.files['file'] ? req.files['file'][0] : null;

    const imageUrl = image ? `/uploads/image/${image.filename}` : null;
    const fileUrl = file ? `/uploads/file/${file.filename}` : null;

    if (!title || !group_id) {
      throw new Error('Thiếu dữ liệu bắt buộc');
    }

    const newPost = await Post.create({
      title,
      content,
      group_id: group_id,
      user_id: userId,
      image_url: imageUrl,
      file_url: fileUrl
    });
    if (typeof tags === 'string') {
      // Giả sử tags cách nhau bằng dấu cách, có thể thay đổi dấu phân cách nếu cần
      tags = tags.trim().split(/\s+/); 
    } else if (!Array.isArray(tags)) {
      // Nếu không phải chuỗi hoặc mảng thì gán rỗng
      tags = [];
    }
    if (Array.isArray(tags) && tags.length > 0) {
      const tagInstances = [];
      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName.trim() }
        });
        tagInstances.push(tag);
      }
      await newPost.addTags(tagInstances);
    }

    const postWithTags = await Post.findByPk(newPost.id, {
      include: [{ model: Tag, through: { attributes: [] } }]
    });

    return res.status(201).json({
      status: 'success',
      data: postWithTags
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi tạo bài viết trong nhóm'
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      where: { group_id: null },
      include: [{ model: Tag, through: { attributes: [] } }]
    });
    res.status(200).json({ status: 'success', data: allPosts });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lấy bài viết'
    });
  }
};

exports.getPostInGroup = async (req, res) => {
  const { group_id } = req.params;
  try {
    const allPosts = await Post.findAll({
      where: { group_id: group_id },
      include: [{ model: Tag, through: { attributes: [] } }]
    });
    res.status(200).json({ status: 'success', data: allPosts });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lấy bài viết trong nhóm'
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const allPosts = await Post.findAll({
      where: { user_id: user_id },
      include: [{ model: Tag, through: { attributes: [] } }]
    });

    res.status(200).json({
      status: 'success',
      data: allPosts,
      userid: user_id
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lấy bài viết'
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const { id } = req.params;

    const image = req.files && req.files['image'] ? req.files['image'][0] : null;
    const file = req.files && req.files['file'] ? req.files['file'][0] : null;

    const imageUrl = image ? `/uploads/image/${image.filename}` : null;
    const fileUrl = file ? `/uploads/file/${file.filename}` : null;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Bài viết không tồn tại' });
    }

    await Post.update(
      {
        title,
        content,
        image_url: imageUrl || post.image_url,
        file_url: fileUrl || post.file_url
      },
      { where: { id: id } }
    );

    if (Array.isArray(tags)) {
      const tagInstances = [];
      for (const tagName of tags) {
        const [tag] = await Tag.findOrCreate({
          where: { name: tagName.trim() }
        });
        tagInstances.push(tag);
      }
      await post.setTags(tagInstances);
    }

    res.status(200).json({
      status: 'success',
      message: 'Cập nhật bài viết thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi sửa bài viết'
    });
  }
};

// Lấy các bài viết theo tag_id (có thể là 1 hoặc nhiều tag)
exports.getPostsByTag = async (req, res) => {
  const { tag_id } = req.params; // ví dụ: ?tag_id=13 hoặc ?tag_id=13,14

  try {
    if (!tag_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Thiếu tag_id để lọc bài viết'
      });
    }

    const tagIds = tag_id.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    const posts = await Post.findAll({
      include: [
        {
          model: Tag,
          where: { id: tagIds },
          through: { attributes: [] }
        }
      ],
      distinct: true
    });

    res.status(200).json({ status: 'success', data: posts });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lấy bài viết theo tag'
    });
  }
};

