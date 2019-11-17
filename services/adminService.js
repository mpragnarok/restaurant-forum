const db = require('../models'),
  User = db.User,
  Restaurant = db.Restaurant,
  Category = db.Category,
  Comment = db.Comment

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID



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
  deleteRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
        Comment.destroy({ where: { RestaurantId: req.params.id } })
        callback({ status: 'success', message: '' })
      }).catch(e => callback({ status: 'error', message: '' }))

  },
  postRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      return callback({ status: 'error', message: "Name didn't exist" })
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
          .then(() => callback({ status: 'success', message: 'Restaurant was successfully created' }))
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
        .then(() => callback({ status: 'success', message: 'Restaurant was successfully created' }))
    }
  },
  putRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      return callback({ status: 'error', message: "Name didn't exist" })
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then(restaurant => {
          restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link : restaurant.image,
            CategoryId: categoryId
          })
            .then(() => callback({ status: 'success', message: 'Restaurant was successfully to update' }))
        })
      })

    } else {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        restaurant.update({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: restaurant.image,
          CategoryId: categoryId
        })
          .then(() => callback({ status: 'success', message: 'Restaurant was successfully to update' }))
      })
    }
  }, // users controllers
  getUsers: (req, res, callback) => {
    return User.findAll().then(users => {
      callback({ users })
    })
  },

  putUser: (req, res, callback) => {

    return User.findByPk(req.params.id).then(user => {
      user.update({
        isAdmin: !user.isAdmin
      })
        .then(() => callback({ status: 'success', message: 'User was successfully to update' }))
    })
  }
}
module.exports = adminService