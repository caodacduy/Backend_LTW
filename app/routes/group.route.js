const express=require("express")
const router=express.Router();
const groupController=require("../controllers/group.controller");
const checkRole=require('../middlewares/check.middleware')
const authenticateToken = require('../middlewares/auth.middleware')


router.post('/',checkRole.checkLecturer,groupController.createGroups)
router.get('/',authenticateToken,groupController.getGroups)


module.exports=router