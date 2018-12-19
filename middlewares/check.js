const User = require('../lib/sqlite').User
const Comment = require('../lib/sqlite').Comment

module.exports = {
  /**
   * 如果没有登录，提示未登录，跳转至登录页面
   */
  checkLogin: (req, res, next) => {
    if (!req.session.user) {
      req.flash('error', '未登录')
      return res.redirect('/signin') // 返回登录页面
    }
    next()
  },

  /**
   * 如果已经登录，提示已登录，返回之前页面
   */
  checkNotLogin: (req, res, next) => {
    let user = req.session.user
    if (user) {
      req.flash('error', '已登录')
      return res.redirect('back') // 返回之前的页面
    }
    next()
  },

  /**
   * 如果不是管理员，提示没有权限，返回主页
   */
  checkAdmin: async (req, res, next) => {
    console.log('管理员权限检查')
    let user = req.session.user

    // 比对数据
    let userModel = await User.findOne({
      where: {
        name: user.name,
        password: user.password
      }
    })

    if (!userModel) {
      req.flash('error', '你在作弊')
      return res.redirect('/')
    }

    if (userModel.isAdmin === false) {
      req.flash('error', '您没有权限访问')
      return res.redirect('/')
    }

    next()
  },

  /**
   * 如果不是该留言作者，提示没有权限，返回当前页面
   */
  checkOwner: async (req, res, next) => {
    const author = req.session.user
    const commentId = req.params.commentId

    let commentModel = await Comment.findOne({
      where: {
        id: commentId
      },
      include: [
        {
          model: User,
          required: true
        }
      ]
    })

    if (!commentModel) {
      req.flash('error', '留言不存在')
      return res.redirect('back')
    }

    let commentUserId = commentModel.user.id.toString()
    let authorId = author.id.toString()

    if (commentUserId !== authorId) {
      req.flash('error', '没有权限删除留言')
      return res.redirect('back')
    }

    req.commentModel = commentModel

    next()
  }
}
