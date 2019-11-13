const express = require('express'),
  router = express.Router()
const adminController = require('../controllers/api/adminController.js'),
  categoryController = require('../controllers/api/categoryController.js'),
  userController = require('../controllers/api/userController'),
  restController = require('../controllers/api/restController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// show top restaurants
router.get('/restaurants/top', authenticated, authenticatedAdmin, restController.getTop10Restaurants)
// restaurants
router.get('/restaurants', authenticated, authenticatedAdmin, restController.getRestaurants)
router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/admin/restaurants/:id', adminController.getRestaurant)

// admin
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)
router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant)


// categories
router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory)

// user
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

module.exports = router