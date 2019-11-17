const bcrypt = require('bcrypt-nodejs')
const imgur = require('imgur-node-api')
const Sequelize = require('sequelize')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const User = db.User,
  Comment = db.Comment,
  Favorite = db.Favorite,
  Restaurant = db.Restaurant,
  Followship = db.Followship
const Op = Sequelize.Op
const userService = require('../services/userService.js')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    // confirm password
    if (password !== passwordCheck) {
      req.flash('error_messages', 'Passwords are not the same')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email } }).then(user => {
        if (user) {
          req.flash('error_messages', 'This Email is already registered')
          return res.redirect('/signup')
        } else {
          User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', 'Register successfully!')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successfully!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully!')
    req.logout()
    res.redirect('/signin')
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => res.render('profile', data))
  },
  editUser: (req, res) => {
    if (req.params.id == req.user.id) {
      return User.findByPk(req.params.id)
        .then(user => {
          return res.render('editProfile', { user })
        })
    } else {
      return res.redirect('back')
    }
  },
  putUser: (req, res) => {
    userService.putUser(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        return res.redirect(`/users/${data.id}`)
      } else {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
    })
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => res.render('topUser', data)
    )
  },
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => res.redirect('back'))
  },
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => res.redirect('back'))
  }
}

module.exports = userController