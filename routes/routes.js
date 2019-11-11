const express = require('express'),
  router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// authentication function
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

// if user meet homepage, redirect to /restaurant page
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

// show top restaurants
router.get('/restaurants/top', authenticated, restController.getTop10Restaurants)
// user READ restaurants
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)


// handle /admin/restaurants with adminController.getRestaurants
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)


// user signup
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// user signin
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)


// admin CRUD restaurant
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

// admin read and update users permission
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id', authenticatedAdmin, adminController.putUser)

// admin restaurants category CRUD
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

//comments CRUD
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)


// show top user
router.get('/users/top', authenticated, userController.getTopUser)
// user profile CRU
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)



// favorite POST and Delete
router.post('/like/:restaurantId', authenticated, restController.addLike)
router.delete('/like/:restaurantId', authenticated, restController.removeLike)

// Like POST and Delete
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// Follow POST and DELETE
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)


// show dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)



module.exports = router