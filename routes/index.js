const restController = require('../controllers/restController.js')
module.exports = app => {

  // if user meet homepage, redirect to /restaurant page
  app.get('/', (req, res) => res.redirect('/restaurants'))

  // under /restaurants, let restController.getRestaurants handles
  app.get('/restaurants', restController.getRestaurants)
}