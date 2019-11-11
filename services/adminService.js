const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const Category = db.Category


const adminService = {

  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      callback({ restaurants })
    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      callback({ restaurant })
    })
  },
  getCategories: (req, res, callback) => {
    return Category.findAll()
      .then(categories => {
        callback({ categories })
      })
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            callback({ status: 'success', message: '' })
          })
      })
  },
  postRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      req.flash('error_messages', "Name didn't exist")
      return res.redirect('back')
    }
    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link : null,
            CategoryId: categoryId
          })
          .then(restaurant => {
            callback({ status: 'success', message: 'Restaurant was successfully created' })
          })
      })

    } else {
      return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: null,
          CategoryId: categoryId
        })
        .then(restaurant => {
          callback({ status: 'success', message: 'Restaurant was successfully created' })
        })
    }

  }
}
module.exports = adminService