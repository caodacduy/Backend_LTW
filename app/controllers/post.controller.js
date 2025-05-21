
const { where } = require('sequelize');
const db=require('../models/index');
const Post= db.Post;

exports.createPost =async(req,res)=>{
    try {
        const userId = req.user.id;
        const { title, content } = req.body;
    if (!title || !content) {
        throw new Error('Thiếu dữ liệu bắt buộc');
      }

    const newPost = await Post.create({
        title,
        content,
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

exports.createPostInGroup =async(req,res)=>{
    try {
        const {group_id}=req.params
        console.log(group_id)
        const userId = req.user.id;
        const { title, content } = req.body;
    if (!title || !content || !group_id) {
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

exports.updatePost = async(req,res)=>{
    try {
        const {title,content}=req.body
        const {id}=req.params
        console.log(id)
        const newPost =await Post.update({
            title:title,
            content:content
        },
    {
        where :{id:id}
    })
    res.status(200).json({
            status: 'success',
        })
    } catch (error) {
        return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi sua bai viet'
    });
    }


}



