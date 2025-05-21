const authenticateToken = require("../middlewares/auth.middleware");
const express=require("express")
const router=express.Router();
const postController= require('../controllers/post.controller')

router.post('/',authenticateToken,postController.createPost)
router.post('/:group_id',authenticateToken,postController.createPostInGroup)
router.get('/public',authenticateToken,postController.getPost)
router.get('/my_post',authenticateToken,postController.getPostById)
router.get('/:group_id',authenticateToken,postController.getPostInGroup)

router.put('/:id',authenticateToken,postController.updatePost)

module.exports = router