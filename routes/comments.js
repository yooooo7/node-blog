const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const checkOwner = require('../middlewares/check').checkOwner

// 响应创建留言逻辑
router.post('/', checkLogin, (req, res, next) => {
  res.send('创建留言')
})

// 响应删除留言逻辑
router.get('/:commentId/remove', [checkLogin, checkOwner], (req, res, next) => {
  res.send('删除留言')
})

module.exports = router
