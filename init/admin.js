const User = require('../lib/sqlite').User
const sha1 = require('sha1')

let admin = {
  name: '宫业奇_Y7',
  email: 'gongyeqi.y7@gmail.com',
  password: sha1('admin7'),
  isAdmin: true
}
User.create(admin)
  .then(() => {
    console.log(`创建管理员：${admin.name}`)
  })
  .catch((e) => {
    console.log(e.errors[0].message)
  })
