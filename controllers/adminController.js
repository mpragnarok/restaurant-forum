const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID


const adminController = {
  // CRUD restaurants controllers
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      res.render('admin/restaurants', { restaurants })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
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
            image: file ? img.data.link : null
          })
          .then(restaurant => {
            req.flash('success_messages', 'Restaurant was successfully created')
            res.redirect('/admin/restaurants')
          })
      })

    } else {
      return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: null
        })
        .then(restaurant => {
          req.flash('success_messages', 'Restaurant was successfully created')
          res.redirect('/admin/restaurants')
        })
    }

  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('admin/restaurant', { restaurant })
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('admin/create', { restaurant })
    })
  },
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_messages', "Name didn't exist")
      return res.redirect('back')
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
              image: file ? img.data.link : restaurant.image
            })
            .then(restaurant => {
              req.flash('success_messages', 'Restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
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
            image: restaurant.image
          })
          .then(restaurant => {
            req.flash('success_messages', 'Restaurant was successfully to update')
            res.redirect('/admin/users')
          })
      })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            res.redirect('/admin/restaurants')
          })
      })
  },
  // users controllers
  getUsers: (req, res) => {
    return User.findAll().then(users => {
      res.render('admin/users', { users })
    })
  },
  putUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      user.update({
          isAdmin: !user.isAdmin
        })
        .then(user => {
          req.flash('success_messages', 'User was successfully to update')
          res.redirect('/admin/users')
        })
    })
  }
}

module.exports = adminController