const express=require("express")
const router=express.Router();
const userController=require("../controllers/user.controller");
const { checkPermission } = require("../middlewares/checkPermission");

router.get('/',userController.getAllUsers)
router.get('/:id',checkPermission,userController.getUserById)
router.put('/:id',userController.updateUser)
router.delete('/:id',userController.deleteUser)

module.exports=router