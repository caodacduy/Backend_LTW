
const db=require('../models/index');
const User =db.User;

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



// module.exports={checkPermission}