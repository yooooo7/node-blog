const path = require('path')

module.exports = {
  port: 3000,
  session: {
    secret: 'JTDWYSYGXXB',
    key: 'gongy7blog',
    maxAge: 2592000000
  },
  sqlite: {
    storage: path.join(__dirname, '../database.sqlite')
  }
}
