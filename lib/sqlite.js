const Sequelize = require('sequelize')
const sequelize = require('../index').sequelize

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

const User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
})

// force: true 如果表已经存在，将会丢弃表
User.sync({ force: true }).then(() => {
  // 表已创建
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  })
})
