const S = require('sequelize')
const sequelize = require('../db.js')
class Tag extends S.Model { }

Tag.init({
    name: {
        type: S.STRING,
        allowNull: false
    }

}, { sequelize, modelName: 'tag' })



module.exports = Tag