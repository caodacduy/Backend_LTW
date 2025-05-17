const express=require("express")
const router=express.Router();
const authController=require('../controllers/auth.controller');
const authenticateToken = require("../middlewares/auth.middleware");

// router.get('/',userController.getAllUsers);
router.post('/register',authController.createUser)
router.post('/login',authController.login)
router.get('/profile',authenticateToken,authController.getProfile)

module.exports = router;