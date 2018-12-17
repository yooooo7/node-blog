const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const Sequelize = require('sequelize')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const flash = require('connect-flash')
const routes = require('./routes')
const pkg = require('./package')

const config = require('config-lite')(__dirname)

const app = express()

// 初始化数据库连接
const sequelize = new Sequelize({
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  storage: config.sqlite.storage
})

// 导出数据库连接
module.exports.sequelize = sequelize

// 设置模板目录
app.set('views', path.join(__dirname, 'views'))

// 设置模板引擎为 ejs
app.set('view engine', 'ejs')

// 设置静态文件目录
app.use('/static', express.static(path.join(__dirname, 'static')))

// 生成 Store 实例
const store = new SequelizeStore({
  db: sequelize // 将 session 存储在 sqlite 中
})

// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 防止 Cookie 被篡改
  resave: false, // 不强制更新 session
  saveUninitialized: false, // 强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store
}))

// 将 session 表添加至数据库（IF NOT EXIST）
store.sync()

// flash 中间件
app.use(flash())

// 解析请求中间件
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 设置模板常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

// 设置模板变量
app.use((req, res, next) => {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

// 路由
routes(app)

// 监听端口，启动程序
app.listen(config.port, () => {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
