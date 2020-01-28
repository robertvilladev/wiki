const S = require('sequelize')
const sequelize = require('../db.js')
class Page extends S.Model { }

Page.init({
    title: {
        type: S.STRING,
        allowNull: false
    },

    urltitle: {
        type: S.STRING
    },

    content: {
        type: S.STRING,
        allowNull: false
    },

    status: {
        type: S.BOOLEAN
    },

    date: {
        type: S.DATE,
        defaultValue: S.NOW
    },

    route: {
        type: S.VIRTUAL,
        get() {
            return '/wiki/' + this.getDataValue(urltitle)
        }
    }
}, { sequelize, modelName: 'page' })


module.exports = Page