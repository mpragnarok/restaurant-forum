const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant


const adminController = {
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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? `/upload/${file.originalname}` : null
            })
            .then(restaurant => {
              req.flash('success_messages', 'Restaurant was successfully created')
              res.redirect('/admin/restaurants')
            })
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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(req.params.id).then(restaurant => {
            restaurant.update({
                name,
                tel,
                address,
                opening_hours,
                description,
                image: file ? `/upload/${file.originalname}` : restaurant.image
              })
              .then(restaurant => {
                req.flash('success_messages', 'Restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
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
            res.redirect('/admin/restaurants')
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
  }
}

module.exports = adminController