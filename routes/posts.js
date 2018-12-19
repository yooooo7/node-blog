const marked = require('marked')
const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const checkAdmin = require('../middlewares/check').checkAdmin

const Post = require('../lib/sqlite').Post
const Comment = require('../lib/sqlite').Comment
const User = require('../lib/sqlite').User

// 响应文章列表页面
router.get('/', async (req, res, next) => {
  // 查找文章列表
  let postsList = await Post.findAll({
    attributes: ['id', 'title', 'desc', 'author', 'pv'],
    order: [
      ['createdAt', 'DESC']
    ]
  })

  // 渲染模板
  return res.render('posts', {
    posts: postsList
  })
})

// 响应文章发表页面
router.get('/create', [checkLogin, checkAdmin], (req, res, next) => {
  res.render('edit')
})

// 响应文章详情页面
router.get('/:postId', (req, res, next) => {
  const postId = req.params.postId

  Promise.all([
    Post.findById(postId),
    Comment.findAll({
      where: {
        postId: postId
      },
      include: [
        {
          model: User,
          required: true
        }
      ]
    })
  ]).then(async (result) => {
    const curPost = result[0]
    const commentList = result[1]

    // 未找到文章
    if (!curPost) {
      req.flash('error', '文章不存在')
      return res.redirect('/posts')
    }

    // PV ++
    let curPv = curPost.pv
    await Post.update({ pv: curPv + 1 }, { where: { id: postId } })

    // 渲染 markdown
    curPost.content = marked(curPost.content)

    res.render('post-content', {
      post: curPost,
      comments: commentList
    })
  }).catch(next)
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

  // 验证必填项目
  if (!(title.length && author.length && content.length)) {
    req.flash('error', '请填写星号项')
    return res.redirect('back')
  }

  // 建立博客信息
  let post = {
    title,
    desc,
    author,
    content
  }

  // 验证文章是否存在
  let article = await Post.findOne({ where: { id: postId } })

  if (!article) {
    req.flash('error', '文章不存在')
    return res.redirect('/posts')
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

  let post = await Post.findOne({ where: { id: postId } })

  if (!post) {
    req.flash('error', '文章不存在')
    return res.redirect('/posts')
  }

  try {
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
