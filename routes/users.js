const express = require('express')
const routes = express.Router()
const { User, Page } = require('../models')

// ruta principal para users

routes.get('/', function (req, res, next) {
    User.findAll({})
        .then((users) => {
            console.log(users[0].dataValues)
            res.render('users', { users });
        })
        .catch(next);
});

routes.get('/:id', (req, res) => {
    Page.findAll({
        where: {
            authorId: req.params.id
        }
    })
        .then((values) => {
            return User.findByPk(req.params.id)
                .then((user) => {
                    return { user, pages: values }
                })
        })
        .then((values) => {
            res.render('user.html', values)
        })
})








module.exports = routes