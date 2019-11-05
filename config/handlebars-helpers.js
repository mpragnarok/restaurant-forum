const hbs = require('handlebars')
const moment = require('moment')

hbs.registerHelper('ifCond', function(a, b, options) {
  if (a === b) {
    return options.fn(this)
  }
  return options.inverse(this)
})
hbs.registerHelper('moment', function(a) {
  return moment(a).fromNow()
})