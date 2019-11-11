const express = require('express'),
  router = express.Router()
const adminController = require('../controllers/api/adminController.js')

router.get('/admin/restaurants', adminController.getRestaurants)


module.exports = router