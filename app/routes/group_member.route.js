
const express=require("express");
const groupMemberController=require('../controllers/group_member.controller')
const authenticateToken=require('../middlewares/auth.middleware')
const checkRole=require('../middlewares/check.middleware')
const router=express.Router();

router.post('/join_group',authenticateToken,groupMemberController.joinGroup)
router.get('/pending_member/:groupId',groupMemberController.getPendingMembers)
router.put('/update_status/:groupId',groupMemberController.updateStatus)



module.exports=router
