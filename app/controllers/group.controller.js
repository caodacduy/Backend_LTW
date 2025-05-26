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

exports.getGroupsWithLecture = async (req , res)=>{
  const owner = req.user.id
  console.log(owner)
  try {
    const allGroup = await Group.findAll({
  where: {
    owner_id: 44
  }
});
    // console.log(allGroup)

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

exports.deleteGroup = async(req,res)=>{

  try {
    const id = req.params.id;
    const deleted = await Group.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy Group để xóa' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Xóa group thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi xóa Group'
    });
  }
}

exports.updateGroup = async(req,res)=>{
  try {
    const id = req.params.id;
    const {name,description}=req.body;

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    await  group.update({ name,description});

    return res.status(200).json({
      status: 'success',
      data: group
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi cập nhật người dùng'
    });
  }
}