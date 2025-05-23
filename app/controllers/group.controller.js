const db=require('../models/index');
const Group=db.Group;

exports.createGroups= async(req,res)=>{
    const owner = req.user.id
    try {
        const {name,description}=req.body;
        if (!name || !description ) {
            throw new Error("Hãy nhập đủ thông tin")
        }
        const newGroups= await Group.create({
        name,
        description,
        owner_id:owner
      });
      return res.status(201).json({
        status:"success",
        data:newGroups
      })
    } catch (error) {
        return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi tạo người dùng'
    });
    }
}

exports.getGroups = async (req , res )=>{
  try {
    const allGroup = await Group.findAll()
    console.log(allGroup)

    return res.status(200).json({
      status:"success",
      data:allGroup
    })
  } catch (error) {
    return res.status(400).json({
      status:"success",
      error:error
    })
  }
}