const express = require('express')
const app = express()
const path = require('path')
const nunjucks = require('nunjucks')
const db = require('./models')
const routes = require('./routes')


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// aca estamos usando nunjucks
app.engine('html', nunjucks.render); // como renderear templates html
app.set('view engine', 'html'); // que extensiones de archivo tienen los templates
nunjucks.configure('views', { noCache: true });

app.use(express.static(path.join(__dirname, '/public')));

app.use('/', routes)


// midlleware que recoge todo slos errores
app.use('/', (error, req, res, next) => {
    if (error) return console.log(error)
})


// sincornizar
const models = require('./models')

models.db.sync({ force: true })
    .then(() => {
        // asegurate de reemplazar el nombre de abajo con tu app de express
        app.listen(3000, function () {
            console.log('Server is listening on port 3000!');
        });
    })
    .catch(console.error);