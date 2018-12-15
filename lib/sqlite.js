const Sequelize = require('sequelize')
const sequelize = require('../index').sequelize
const sha1 = require('sha1')

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  timestamps: true
})

// force: true 如果表已经存在，将会丢弃表
User.sync({ force: true }).then(async () => {
  // 创建管理员用户
  let admin = {
    name: 'y7',
    email: 'gongyeqi.y7@gmail.com',
    password: sha1('admin7'),
    isAdmin: true
  }
  await User.create(admin)
  return console.log(`创建管理员：${admin.name}`)
})

exports.User = User

const Post = sequelize.define('post', {
  title: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  desc: {
    type: Sequelize.STRING(200),
    allowNull: true
  },
  author: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pv: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  timestamps: true
})

Post.sync({ force: false })
  .then(() => console.log('成功创建 Post'))
  .catch(e => console.log(e))

exports.Post = Post
