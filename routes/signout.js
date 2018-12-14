const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// 响应登出逻辑
router.get('/', checkLogin, (req, res, next) => {
  res.send('登出')
})

module.exports = router
