
const db=require('../models/index');
const User =db.User;
const Group = db.Group

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

 exports.checkPermission= async(req,res,next)=>{
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            return res.status(403).json({
                status: "error",
                message:"Bạn chưa đăng nhập",
            })
        }
        const decoded=jwt.verify(token,JWT_SECRET)

        const user=await User.findByPk(decoded.id)


        if(!user){
            return res.status(403).json({
                status: "error",
                message:"Token loi"
            })
        }

        if(user.role!="admin"){
            return res.status(400).json({
                message:"Bạn không có quyền sử dụng "
            })
        }
        next()

    } catch (error) {
        return res.json({
            name:error.name,
            message:error.message
        })
    }
}
exports.checkLecturer= async(req,res,next)=>{
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            return res.status(403).json({
                status: "error",
                message:"Bạn chưa đăng nhập",
            })
        }
        const decoded=jwt.verify(token,JWT_SECRET)

        const user=await User.findByPk(decoded.id)

        req.user= user
        if(!user){
            return res.status(403).json({
                message:"Token loi"
            })
        }

        if(user.role!="lecturer"){
            return res.status(400).json({
                message:"Bạn không có quyền sử dụng "
            })
        }
        next()

    } catch (error) {
        return res.json({
            name:error.name,
            message:error.message
        })
    }
}


exports.verifyGroupOwner = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.groupId;

    const group = await Group.findByPk(id);
    console.log(group)
    if (!group) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy nhóm'
      });
    }
    console.log(group.owner_id)
    if (group.owner_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền quản lý nhóm này'
      });
    }

    next(); // Cho phép tiếp tục
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message||'Lỗi xác minh quyền sở hữu nhóm'
    });
  }
};



// module.exports={checkPermission}