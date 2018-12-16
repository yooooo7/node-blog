const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const checkOwner = require('../middlewares/check').checkOwner

const Comment = require('../lib/sqlite').Comment

// 响应创建留言逻辑
router.post('/', checkLogin, async (req, res, next) => {
  const author = req.session.user.id
  const { postId, content } = req.body

  if (!content.length) {
    req.flash('error', '请填写留言内容')
    return res.redirect('back')
  }

  let comment = {
    userId: author,
    content,
    postId
  }

  try {
    // 写入数据库
    await Comment.create(comment)
    req.flash('success', '留言成功')
    return res.redirect(`/posts/${postId}`)
  } catch (e) {
    console.log(e)
    req.flash('error', '出错啦！')
    return res.redirect('back')
  }
})

// 响应删除留言逻辑
router.get('/:commentId/remove', [checkLogin, checkOwner], (req, res, next) => {
  res.send('删除留言')
})

module.exports = router
