const express = require('express'),
  router = express.Router()
const adminController = require('../controllers/api/adminController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.get('/admin/categories', adminController.getCategories)

router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)

module.exports = router