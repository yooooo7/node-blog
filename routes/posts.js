const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const checkAdmin = require('../middlewares/check').checkAdmin
const checkAuthor = require('../middlewares/check').checkAuthor

// 响应文章列表页面
router.get('/', (req, res, next) => {
  res.send('文章列表页')
})

// 响应文章详情页面
router.get('/:postId', (req, res, next) => {
  res.send('文章详情页')
})

// 响应文章发表页面
router.get('/create', [checkLogin, checkAdmin], (req, res, next) => {
  res.send('发表文章页')
})

// 响应文章发表逻辑
router.post('/create', [checkLogin, checkAdmin], (req, res, next) => {
  res.send('发表文章')
})

// 响应文章修改页面
router.get('/:postId/edit', [checkLogin, checkAdmin, checkAuthor], (req, res, next) => {
  res.send('修改文章页')
})

// 响应文章修改逻辑
router.post('/:postId/edit', [checkLogin, checkAdmin, checkAuthor], (req, res, next) => {
  res.send('修改文章')
})

// 响应文章删除逻辑
router.get('/:postId/remove', [checkLogin, checkAdmin, checkAuthor], (req, res, next) => {
  res.send('删除文章')
})

module.exports = router
