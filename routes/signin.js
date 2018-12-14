const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// 响应登陆页面
router.get('/', checkNotLogin, (req, res, next) => {
  res.send('登录页')
})

// 响应登录逻辑
router.post('/', checkNotLogin, (req, res, next) => {
  res.send('登录')
})

module.exports = router
