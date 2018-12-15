const express = require('express')
const router = express.Router()
const sha1 = require('sha1')

const User = require('../lib/sqlite').User
const checkNotLogin = require('../middlewares/check').checkNotLogin

// 响应注册页面
router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signup')
})

// 响应注册逻辑
router.post('/', checkNotLogin, async (req, res, next) => {
  let { name, password } = req.body

  // 检测账号密码是否合规
  try {
    if (!(name.length >= 1 && name.length <= 15)) {
      throw new Error('名称请限制在 1-15 个字符')
    }
    if (!(password.length >= 6 && password.length <= 18)) {
      throw new Error('密码在 6-18 位之间')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  // 明文密码加密
  password = sha1(password)

  // 建立用户信息
  let user = {
    name,
    password
  }

  // 用户信息写入
  User.create(user)
    .then(result => {
      let user = result.dataValues

      // 将用户信息存入 session
      req.session.user = user

      // 写入 flash
      req.flash('success', '注册成功')

      return res.redirect('/')
    })
    .catch(e => {
      if (e.errors[0].message === 'name must be unique') {
        req.flash('error', '用户名已被占用')
        return res.redirect('/signup')
      }
      next(e)
    })
})

module.exports = router
