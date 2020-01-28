const express = require('express')
const routes = express.Router()
const { Users, Pages } = require('../models')

// ruta 
routes.get('/', (req, res) => {
    Pages.findAll()
        .then((values) => {
            res.render('index.html', { pages: values })
        })
})

routes.get('/wiki/add', (req, res) => {
    res.render('addpage.html')
})

routes.post('/wiki/', (req, res) => {
    Users.create({
        name: req.body.authorName,
        email: req.body.email
    });
    Pages.create({
        title: req.body.title,
        content: req.body.content
    })

    res.redirect('/')
})

module.exports = routes