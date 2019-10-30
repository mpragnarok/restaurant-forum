const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
module.exports = app => {

  // if user meet homepage, redirect to /restaurant page
  app.get('/', (req, res) => res.redirect('/restaurants'))

  // under /restaurants, let restController.getRestaurants handles
  app.get('/restaurants', restController.getRestaurants)

  // handle /admin/restaurants with adminController.getRestaurants
  app.get('/admin/restaurants', adminController.getRestaurants)

  // user signup
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
}