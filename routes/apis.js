const express = require('express'),
  router = express.Router()
const adminController = require('../controllers/api/adminController.js'),
  categoryController = require('../controllers/api/categoryController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)


router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)


// categories
router.get('/admin/categories', categoryController.getCategories)

module.exports = router