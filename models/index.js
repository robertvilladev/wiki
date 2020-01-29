const db = require('../db.js')
const Page = require('./page')
const User = require('./user')
const Tag = require('./tag')

// relaciones entre tablas
Page.belongsTo(User, { as: 'author' })


Tag.belongsToMany(Page, { through: 'TagPages' });
Page.belongsToMany(Tag, { through: 'TagPages' });



// 
module.exports = { Page, User, Tag, db }

