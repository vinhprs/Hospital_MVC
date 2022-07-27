const express = require('express')
const hbs  = require('express-handlebars')
const path = require('path')
const app = express()
const port = process.env.port || 3000
const bodyParser = require('body-parser');
const route = require('./routes')

// use static file
app.use(express.static(path.join(__dirname, 'public')))

// template engine
app.engine('handlebars', hbs.engine({
  helpers: {
    sum: (a,b) => a+b
  }
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'resources', 'views'))

// Return body obj for Post method
app.use(express.json());
// app.use(express.urlencoded({
//   extended: false
// }));
app.use(bodyParser.urlencoded({
  extended: true
}))

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
route(app)