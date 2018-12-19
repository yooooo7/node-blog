const path = require('path')

module.exports = {
  port: 80,
  session: {
    secret: 'QWEasdzxc123',
    key: 'gongy7blog',
    maxAge: 2592000000
  },
  sqlite: {
    storage: path.join(__dirname, '../db.sqlite')
  }
}
