const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const checkAdmin = require('../middlewares/check').checkAdmin

const Post = require('../lib/sqlite').Post

// 响应文章列表页面
router.get('/', async (req, res, next) => {
  let postsList = await Post.findAll({
    attributes: ['id', 'title', 'desc', 'author', 'pv']
  })
  return res.render('posts', {
    posts: postsList
  })
})

// 响应文章发表页面
router.get('/create', [checkLogin, checkAdmin], (req, res, next) => {
  res.render('create')
})

// 响应文章详情页面
router.get('/:postId', async (req, res, next) => {
  const postId = req.params.postId

  try {
    let curPost = await Post.findById(postId)

    if (!curPost) {
      throw new Error('该文章不存在')
    }

    let curPv = curPost.pv
    await Post.update({ pv: curPv + 1 }, { where: { id: postId } })

    res.render('post-content', {
      post: curPost
    })
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/posts')
  }
})

// 响应文章发表逻辑
router.post('/create', [checkLogin, checkAdmin], async (req, res, next) => {
  let { title, desc, author, content } = req.body

  // 验证必填项目
  if (!(title.length && author.length && content.length)) {
    req.flash('error', '请填写星号项')
    return res.redirect('back')
  }

  // 简历博客信息
  let post = {
    title,
    desc,
    author,
    content
  }

  try {
    // 写入数据库
    let article = await Post.create(post)
    req.flash('success', '发表成功')
    return res.redirect(`/posts/${article.id}`)
  } catch (e) {
    console.log(e)
    req.flash('error', '出错啦！')
    return res.redirect('back')
  }
})

// 响应文章修改页面
router.get('/:postId/edit', [checkLogin, checkAdmin], async (req, res, next) => {
  const postId = req.params.postId
  let article = await Post.findOne({ where: { id: postId } })

  if (!article) {
    req.flash('error', '没有此文章')
    return res.redirect('/posts')
  }

  return res.render('edit', {
    post: article
  })
})

// 响应文章修改逻辑
router.post('/:postId/edit', [checkLogin, checkAdmin], async (req, res, next) => {
  const postId = req.params.postId
  let { title, desc, author, content } = req.body

  // 验证文章是否存在
  let article = await Post.findOne({ where: { id: postId } })

  if (!article) {
    req.flash('error', '文章不存在')
    return res.redirect('/posts')
  }

  // 验证必填项目
  if (!(title.length && author.length && content.length)) {
    req.flash('error', '请填写星号项')
    return res.redirect('back')
  }

  // 简历博客信息
  let post = {
    title,
    desc,
    author,
    content
  }

  try {
    // 更新数据库
    let result = await article.update(post)
    req.flash('success', '更新成功')
    return res.redirect(`/posts/${result.id}`)
  } catch (e) {
    console.log(e)
    req.flash('error', '出错啦！')
    return res.redirect('back')
  }
})

// 响应文章删除逻辑
router.get('/:postId/remove', [checkLogin, checkAdmin], async (req, res, next) => {
  const postId = req.params.postId
  try {
    let post = await Post.findOne({ where: { id: postId } })
    await post.destroy()
    req.flash('success', '删除成功')
    return res.redirect('/posts')
  } catch (e) {
    console.log(e)
    req.flash('error', '删除失败')
    return res.redirect('/posts')
  }
})

module.exports = router
