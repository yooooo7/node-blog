const Sequelize = require('sequelize')
const sequelize = require('../index').sequelize

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/i,
      len: [2, 15]
    }
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
  category: {
    type: Sequelize.STRING(30),
    allowNull: true,
    defaultValue: 'essay',
    validate: {
      isIn: [['coding', 'essay', 'photography', 'operation', 'writing', 'design', 'others']]
    }
  }
})

const Comment = sequelize.define('comment', {
  content: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

Post.hasMany(Comment)
Comment.belongsTo(Post)

User.hasMany(Comment)
Comment.belongsTo(User)

// force: true 如果表已经存在，将会丢弃表
User.sync({ force: false })

Post.sync({ force: false })
  .catch(e => console.log(e))

Comment.sync({ force: false })
  .catch(e => console.log(e))

exports.User = User
exports.Post = Post
exports.Comment = Comment
