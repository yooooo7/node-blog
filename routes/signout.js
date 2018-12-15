const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// 响应登出逻辑
router.get('/', checkLogin, (req, res, next) => {
  // 清空 session.user
  req.session.user = null

  req.flash('success', '登出成功')
  return res.redirect('/')
})

module.exports = router
