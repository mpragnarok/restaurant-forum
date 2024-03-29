const express = require('express')
const app = express()
const db = require('../models')
const exphbs = require('express-handlebars')
require('../config/handlebars-helpers')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cors = require('cors')
const methodOverride = require('method-override')
const port = process.env.PORT || 3000
const hbs = exphbs.create({
  extname: 'hbs',

})
if (process.env.NODE_ENV !== 'prodoction') {
  require('dotenv').config()
}

const passport = require('../config/passport')

// cors 的預設為全開放
app.use(cors())

// setup handlebars engine and file extension
app.engine(hbs.extname, hbs.engine, exphbs())
app.set('view engine', hbs.extname)

// body-parser setting
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// setup session
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }))
// setup passport
app.use(passport.initialize())
app.use(passport.session())
// setup flash message
app.use(flash())



// method-override
app.use(methodOverride('_method'))

// upload route
app.use('/upload', express.static(__dirname + '/../upload'))
// static files
app.use(express.static("public"))

// include req.flash in res.locals
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})
app.listen(port, () => {

  console.log(`Server is listening on port ${port}!`)
})

require('../routes')(app)