
const express=require("express");
const groupMemberController=require('../controllers/group_member.controller')
const authenticateToken=require('../middlewares/auth.middleware')
const checkRole=require('../middlewares/check.middleware')
const router=express.Router();

router.post('/join_group',authenticateToken,groupMemberController.joinGroup)
router.get('/pending_member/:groupId',checkRole.checkLecturer,checkRole.verifyGroupOwner,groupMemberController.getPendingMembers)
router.get('/accepted_member/:groupId',checkRole.checkLecturer,checkRole.verifyGroupOwner,groupMemberController.getMembersAccepted)
router.put('/update_accepted/:groupId',checkRole.checkLecturer,checkRole.verifyGroupOwner,groupMemberController.updateStatus)
router.delete('/delete_rejected/:id',checkRole.checkLecturer,checkRole.verifyGroupOwner,groupMemberController.deleteMemberOrRejected)

module.exports=router
