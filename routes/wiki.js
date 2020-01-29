const express = require('express')
const routes = express.Router()
const { User, Page, Tag } = require('../models')
const Promise = require('bluebird')

// ruta 
routes.get('/', (req, res) => {
    Page.findAll()
        .then((values) => {
            res.render('index.html', { pages: values })
        })
})

routes.get('/add', (req, res) => {
    res.render('addpage.html')
})


// Ruta para crear paginas 
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
                content: req.body.conten0t,
                urltitle: req.body.title.split(" ").join('_')
            })
            return page.then((page) => {
                page.setAuthor(user);
                return page
            })
        })
        .then((page) => {
            const tags = req.body.tags.split(' ')
                .map(tag => {
                    console.log(tag)
                    return Tag.findOrCreate({
                        where: {
                            name: tag
                        }
                    })
                        .then((val) => {
                            console.log(val)
                            return page.addTag(val)
                        })
                })

            return Promise.all(tags)
                .then((values) => {
                    //console.log(values)
                    //page.addTags(values)
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
            return page.getTags()
                .then((tags) => {
                    return { page, tags: tags.map(p => p.name) }
                })
                .then((val) => {
                    return val.page.getAuthor()
                        .then((author) => {
                            return { page: val.page, author, tags: val.tags }
                        })
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
            page.urltitle = req.body.title.split(" ").join('_')

            return page.save()
        })
        .then(() => {
            res.redirect('/wiki/' + req.params.urltitle)
        })
})

module.exports = routes