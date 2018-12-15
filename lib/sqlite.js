const Sequelize = require('sequelize')
const sequelize = require('../index').sequelize

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
User.sync({ force: true })

exports.User = User
