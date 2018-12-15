const express = require('express')
const router = express.Router()
const sha1 = require('sha1')

const User = require('../lib/sqlite').User
const checkNotLogin = require('../middlewares/check').checkNotLogin

// 响应登陆页面
router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signin')
})

// 响应登录逻辑
router.post('/', checkNotLogin, async (req, res, next) => {
  let { name, password } = req.body

  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let user = await User.findOne({ where: { name: name } })

  try {
    // 检查用户是否存在
    if (!user) {
      throw new Error('用户不存在')
    }
    // 校验密码
    if (user.password !== sha1(password)) {
      throw new Error('用户名或密码错误')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  req.flash('success', '登录成功')

  // 用户信息写入 session
  delete user.password
  req.session.user = user

  // 跳转到主页
  return res.redirect('/')
})

module.exports = router
