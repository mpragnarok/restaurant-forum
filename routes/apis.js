const express = require('express'),
  router = express.Router()
const adminController = require('../controllers/api/adminController.js'),
  categoryController = require('../controllers/api/categoryController.js'),
  userController = require('../controllers/api/userController'),
  restController = require('../controllers/api/restController'),
  commentController = require('../controllers/api/commentController')
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
router.get('/restaurants/feeds', authenticated, authenticatedAdmin, restController.getFeeds)
router.get('/restaurants/:id', authenticated, authenticatedAdmin, restController.getRestaurant)

// show dashboard
router.get('/restaurants/:id/dashboard', authenticated, authenticatedAdmin, restController.getDashboard)

// admin
router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)
router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

// admin read and update users permission
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id', authenticated, authenticatedAdmin, adminController.putUser)

// categories
router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory)

// user
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)


//comments CRUD
router.post('/comments', authenticated, authenticatedAdmin, commentController.postComment)
router.delete('/comments/:id', authenticated, authenticatedAdmin, commentController.deleteComment)

// show top user
router.get('/users/top', authenticated, authenticatedAdmin, userController.getTopUser)
// user profile CRU
// router.get('/users/:id', authenticated, userController.getUser)
// router.get('/users/:id/edit', authenticated, userController.editUser)
// router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)


// favorite POST and Delete
router.post('/like/:restaurantId', authenticated, authenticatedAdmin, restController.addLike)
router.delete('/like/:restaurantId', authenticated, authenticatedAdmin, restController.removeLike)

module.exports = router