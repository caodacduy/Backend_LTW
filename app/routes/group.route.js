const express=require("express")
const router=express.Router();
const groupController=require("../controllers/group.controller");
const checkRole=require('../middlewares/check.middleware')


router.post('/',checkRole.checkLecturer,groupController.createGroups)


module.exports=router