
const db=require('../models/index');
const Post= db.Post;
const Tag = db.Tag;

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, tags } = req.body;

    if (!title) {
      throw new Error('Thiếu dữ liệu bắt buộc');
    }

    // Lấy file từ req.files
    const image = req.files['image'] ? req.files['image'][0] : null;
    const file = req.files['file'] ? req.files['file'][0] : null;

    const imageUrl = image ? `/uploads/image/${image.filename}` : null;
    const fileUrl = file ? `/uploads/file/${file.filename}` : null;

    // 1. Tạo bài viết mới
    const newPost = await Post.create({
      title,
      content,
      user_id: userId,
      image_url: imageUrl,
      file_url: fileUrl
    });

    // 2. Gắn tag nếu có
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

    // 3. Trả về bài viết có tag
    const postWithTags = await Post.findByPk(newPost.id, {
      include: [{
        model: Tag,
        through: { attributes: [] }
      }]
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

exports.createPostInGroup =async(req,res)=>{
    try {
        const {group_id}=req.params
        console.log(group_id)
        const userId = req.user.id;
        const { title, content } = req.body;
    if (!title || !group_id) {
        throw new Error('Thiếu dữ liệu bắt buộc');
      }
    
    const newPost = await Post.create({
        title,
        content,
        group_id:group_id,
        user_id:userId
    })
    return res.status(201).json({
      status: 'success',
      data: newPost
    });
    } catch (error) {
        return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi tạo bai viet'
    });
    }
}


exports.getPost = async(req,res)=>{
    try {
        const allPosts = await Post.findAll({
            where: {
                group_id: null
            }
        })
        res.status(200).json({
            status: 'success',
            data:allPosts
        })
    } catch (error) {
        return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lay bai viet'
    });
    }
}

exports.getPostInGroup = async(req,res)=>{
    const {group_id}=req.params;
    try {
        const allPosts = await Post.findAll({
            where: {
                group_id: group_id
            }
        })
        res.status(200).json({
            status: 'success',
            data:allPosts
        })
    } catch (error) {
        return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lay bai viet'
    });
    }
}

exports.getPostById = async (req, res) => {
  try {
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const allPosts = await Post.findAll({
      where: {
        user_id: user_id
      }
    });

    console.log('user_id:', user_id);
    console.log('allPosts:', allPosts);

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
    const { title, content } = req.body;
    const { id } = req.params;

    // Kiểm tra nếu không có id
    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Thiếu ID bài viết cần cập nhật',
      });
    }

    // Kiểm tra bài viết có tồn tại không
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Bài viết không tồn tại',
      });
    }

    // Tiến hành cập nhật
    await Post.update(
      {
        title: title,
        content: content,
      },
      {
        where: { id: id },
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Cập nhật bài viết thành công',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi sửa bài viết',
    });
  }
};




