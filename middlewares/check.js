module.exports = {
  /**
   * 如果没有登录，提示未登录，跳转至登录页面
   */
  checkLogin: (req, res, next) => {
    if (!req.session.user) {
      req.flash('error', '未登录')
      // return res.redirect('/signin')
    }
    console.log('未登录检查')
    next()
  },

  /**
   * 如果已经登录，提示已登录，返回之前页面
   */
  checkNotLogin: (req, res, next) => {
    if (req.session.user) {
      req.flash('error', '已登录')
      // return res.redirect('back') // 返回之前的页面
    }
    console.log('登录检查')
    next()
  },

  /**
   * 如果不是管理员，提示没有权限，返回主页
   */
  checkAdmin: (req, res, next) => {
    console.log('管理员权限检查')
    next()
  },

  /**
   * 如果不是该文章作者，提示没有权限，返回当前页面
   */
  checkAuthor: (req, res, next) => {
    console.log('作者权限检查')
    next()
  },

  /**
   * 如果不是该留言作者，提示没有权限，返回当前页面
   */
  checkOwner: (req, res, next) => {
    console.log('留言作者检查')
    next()
  }
}
