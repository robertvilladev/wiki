const express = require('express')
const routes = express.Router()
const { User, Page } = require('../models')

// ruta 
routes.get('/', (req, res) => {
    Page.findAll()
        .then((values) => {
            console.log(values)
            res.render('index.html', { pages: values })
        })
})

routes.get('/add', (req, res) => {
    res.render('addpage.html')
})

routes.post('/', (req, res, next) => {
    User.findOrCreate({
        where: {
            name: req.body.authorName,
            email: req.body.email
        }
    })
        .then((values) => {
            const user = values[0]
            const page = Page.create({
                title: req.body.title,
                content: req.body.content,
                urltitle: req.body.title.split(" ").join('_')
            })
            return page.then((page) => {
                page.setAuthor(user);
                return page
            })
        })
        .then(function (page) {
            res.redirect(page.route);
        })
        .catch(next);
})

routes.get('/:urltitle', (req, res, next) => {
    Page.findOne({
        where: {
            urltitle: req.params.urltitle
        }
    })
        .then((page) => {
            return page.getAuthor()
                .then((author) => {
                    return { page, author }
                })
        })
        .then((value) => {
            res.render('wikipage', value)
        })
})


// eliminar la pagina
routes.get('/:id/delete', (req, res, next) => {
    Page.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            res.redirect('/wiki')
        })
})

// editar la pagina
routes.get('/:urltitle/edit', (req, res, next) => {
    Page.findOne({
        where: {
            urltitle: req.params.urltitle
        }
    })
        .then((page) => {
            return page.getAuthor()
                .then((author) => {
                    return { page, author, edit: true }
                })
        })
        .then((value) => {
            res.render('editpage', value)
        })
})

routes.post('/:urltitle/edit', (req, res, next) => {
    Page.findOne({
        where: {
            urltitle: req.params.urltitle
        }
    })
        .then((page) => {
            page.content = req.body.content
            page.title = req.body.title

            return page.save()
        })
        .then(() => {
            res.redirect('/wiki/' + req.params.urltitle)
        })
})

module.exports = routes