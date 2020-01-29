const S = require('sequelize')
const sequelize = require('../db.js')
class User extends S.Model { }

User.init({
    name: {
        type: S.STRING,
        allowNull: false
    },
    email: {
        type: S.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
}, { sequelize, modelName: 'user' });


module.exports = User;