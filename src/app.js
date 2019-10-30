const express = require('express')
const app = express()
const db = require('../models')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 3000
const hbs = exphbs.create({
  extname: 'hbs'
})

// setup handlebars engine and file extension
app.engine(hbs.extname, hbs.engine, exphbs())
app.set('view engine', hbs.extname)

// body-parser setting
app.use(bodyParser.urlencoded({ extended: true }))



app.listen(port, () => {
  db.sequelize.sync() // sync with database
  console.log(`Server is listening on port ${port}!`)
})

require('../routes')(app)