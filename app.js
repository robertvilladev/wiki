const express = require('express')
const app = express()
const path = require('path')
const nunjucks = require('nunjucks')
const db = require('./models')
const volleyball = require('volleyball')



app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(volleyball)


// aca estamos usando nunjucks
app.engine('html', nunjucks.render); // como renderear templates html
app.set('view engine', 'html'); // que extensiones de archivo tienen los templates
nunjucks.configure('views', { noCache: true });


// significa que las carpeta public va a ser visible al usuario! 
app.use(express.static(path.join(__dirname, '/public')));

// ruta principal
const wiki = require('./routes/wiki.js')
app.use('/wiki', wiki)

const users = require('./routes/users.js')
app.use('/users', users)

app.use('/', (req, res) => res.redirect('/wiki/'))


// midlleware que recoge todo slos errores
app.use('/', (error, req, res, next) => {
    if (error) return console.log(error)
})


// sincornizar
const models = require('./models')

models.db.sync(/* { force: true } */)
    .then(() => {
        // asegurate de reemplazar el nombre de abajo con tu app de express
        app.listen(3000, function () {
            console.log('Server is listening on port 3000!');
        });
    })
    .catch(console.error);