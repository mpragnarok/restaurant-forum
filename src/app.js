const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main'
})

// setup handlebars engine and file extension
app.engine(hbs.extname, hbs.defaultLayout)
app.set('view engine', hbs.extname)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`)
})