const authenticateToken = require("../middlewares/auth.middleware");
const express=require("express")
const router=express.Router();
const postController= require('../controllers/post.controller')

router.post('/',authenticateToken,postController.createPost)
router.post('/:group_id',authenticateToken,postController.createPostInGroup)
router.get('/',authenticateToken,postController.getPost)
router.get('/:group_id',authenticateToken,postController.getPostInGroup)

module.exports = router