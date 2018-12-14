const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// 响应注册页面
router.get('/', checkNotLogin, (req, res, next) => {
  res.send('注册页')
})

// 响应注册逻辑
router.post('/', checkNotLogin, (req, res, next) => {
  res.send('注册')
})

module.exports = router
