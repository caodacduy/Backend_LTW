const express=require("express")
const router=express.Router();
const groupController=require("../controllers/group.controller")


router.post('/',groupController.createGroups)

module.exports=router