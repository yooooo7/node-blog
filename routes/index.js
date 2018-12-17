module.exports = app => {
  // 注册主页面
  app.get('/', (req, res) => {
    res.redirect('/posts')
  })

  // 注册其余路由
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))
}
