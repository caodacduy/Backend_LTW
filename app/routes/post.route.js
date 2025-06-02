const authenticateToken = require("../middlewares/auth.middleware");
const express = require("express");
const router = express.Router();
const postController = require('../controllers/post.controller');
const uploadImgController = require('../controllers/upload_img.controller');
const upload = require('../middlewares/upload');
const {verifyMembership} = require('../middlewares/member.middleware')

// Upload ảnh CKEditor
router.post(
  '/upload-image',
  uploadImgController.upload.single('upload'),
  uploadImgController.uploadImg
);

// Tạo bài viết công khai (có upload ảnh và file)
router.post(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]),
  postController.createPost
);

// Tạo bài viết trong nhóm
router.post(
  '/:group_id',
  authenticateToken,verifyMembership,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]),
  postController.createPostInGroup
);

// Lấy bài viết công khai (không thuộc nhóm)
router.get('/public', authenticateToken, postController.getPost);

// Lấy bài viết của chính mình
router.get('/my_post', authenticateToken, postController.getPostById);

// Lấy bài viết trong một nhóm
router.get('/in_group/:group_id', authenticateToken, postController.getPostInGroup);

// Cập nhật bài viết
router.put(
  '/:id',
  authenticateToken,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]),
  postController.updatePost
);

router.get('/tags/:tag_id',authenticateToken,postController.getPostsByTag)


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Quản lý bài viết
 */

/**
 * @swagger
 * /api/post/upload-image:
 *   post:
 *     summary: Upload ảnh
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               upload:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Ảnh được upload thành công
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/post/:
 *   post:
 *     summary: Tạo bài viết công khai
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/post/{group_id}:
 *   post:
 *     summary: Tạo bài viết trong nhóm
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tạo bài viết trong nhóm thành công
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/post/public:
 *   get:
 *     summary: Lấy tất cả bài viết công khai (không thuộc nhóm nào)
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy bài viết thành công
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/post/my_post:
 *   get:
 *     summary: Lấy tất cả bài viết của người dùng
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy bài viết thành công
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/post/in_group/{group_id}:
 *   get:
 *     summary: Lấy bài viết trong một nhóm
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm
 *     responses:
 *       200:
 *         description: Lấy bài viết thành công
 *       500:
 *         description: Lỗi server
 */
/**
 * @swagger
 * /api/post/tags/{tag_id}:
 *   get:
 *     summary: Lấy bài viết theo tag
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm
 *     responses:
 *       200:
 *         description: Lấy bài viết thành công
 *       500:
 *         description: Lỗi server
 */
/**
 * @swagger
 * /api/post/{id}:
 *   put:
 *     summary: Cập nhật bài viết theo ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID bài viết cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi server
 */