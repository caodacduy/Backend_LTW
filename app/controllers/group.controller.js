const db=require('../models/index');
const Group=db.Group;
const GroupMember = db.GroupMember;

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

exports.getGroups = async (req, res) => {
  const userId = req.user.id;

  try {
    const groups = await Group.findAll({
      include: [
        {
          model: GroupMember,
          as: 'GroupMembers',
          where: { user_id: userId },
          required: false,
          attributes: ['status']
        }
      ]
    });

    const formatted = groups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      owner_id: group.owner_id,
      status: group.GroupMembers[0]?.status || null
      // status sẽ là: 'pending', 'accepted' hoặc null (nếu chưa tham gia)
    }));

    return res.status(200).json({
      status: "success",
      data: formatted
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error: error.message
    });
  }
};

exports.getGroupById = async (req, res) => {
  const groupId = req.params.id;

  try {
    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: db.User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: GroupMember,
          as: 'GroupMembers',
          where: { status: 'accepted' },
          required: false, // để nếu chưa có thành viên vẫn không lỗi
          attributes: ['user_id']
        }
      ]
    });

    if (!group) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm' });
    }

    return res.status(200).json({
      id: group.id,
      name: group.name,
      description: group.description,
      created_at: group.created_at,
      owner: group.owner, // { id, name, email }
      member_count: group.GroupMembers.length
    });

  } catch (error) {
    console.error('Lỗi khi lấy group theo ID:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Lỗi server khi lấy chi tiết nhóm'
    });
  }
};

exports.getGroupsWithLecture = async (req , res) => {
  const owner = req.user.id; // ✅ lấy từ token
  try {
    const allGroup = await Group.findAll({
      where: { owner_id: owner }
    });

    return res.status(200).json({
      status: "success",
      data: allGroup
    });
  } catch (error) {
    return res.status(400).json({
      status: "error", // ✅ sửa luôn "status" nếu có lỗi
      message: error.message || "Lỗi khi lấy nhóm của giảng viên"
    });
  }
};

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