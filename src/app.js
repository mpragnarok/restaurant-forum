const express = require('express')
const app = express()
const db = require('../models')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('../config/passport')
const methodOverride = require('method-override')
const port = 3000
const hbs = exphbs.create({
  extname: 'hbs'
})

// setup handlebars engine and file extension
app.engine(hbs.extname, hbs.engine, exphbs())
app.set('view engine', hbs.extname)

// body-parser setting
app.use(bodyParser.urlencoded({ extended: true }))

// setup session
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }))
// setup passport
app.use(passport.initialize())
app.use(passport.session())
// setup flash message
app.use(flash())

// include req.flash in res.locals
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

// method-override
app.use(methodOverride('_method'))


app.listen(port, () => {
  db.sequelize.sync() // sync with database
  console.log(`Server is listening on port ${port}!`)
})

require('../routes')(app, passport)