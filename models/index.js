const db = require('../db.js')
const Page = require('./pages')
const User = require('./user')

//
Page.belongsTo(User, { as: 'author' })



module.exports = { Page, User, db }

