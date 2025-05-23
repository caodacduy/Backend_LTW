const express = require('express');
const router =express.Router();

const authRoutes = require('./auth.route')
const userRoutes = require('./user.route')
const groupRoutes = require('./group.route')
const groupMemberRoutes = require('./group_member.route')
const postRoutes = require('./post.route')
const commentRoutes = require('./comment.route')

router.use('/api/auth',authRoutes)
router.use('/api/users',userRoutes)
router.use('/api/groups',groupRoutes)
router.use('/api/group_member',groupMemberRoutes)
router.use('/api/post',postRoutes)
router.use('/api/comment',commentRoutes)



module.exports = router