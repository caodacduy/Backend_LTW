const express=require("express")
const router=express.Router();
const groupController=require("../controllers/group.controller");
const authenticateToken = require("../middlewares/auth.middleware");


router.post('/',authenticateToken,groupController.createGroups)


module.exports=router