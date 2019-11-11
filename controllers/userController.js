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
    return User.findByPk(req.params.id, {
        include: [
          Comment,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      .then(user => {
        // Remove duplicated restaurantId from  commentRestaurantId array
        const commentRestaurantId = [...new Set(user.dataValues.Comments.map(item => item.RestaurantId))]
        Restaurant.findAll({
          where: {
            id: {
              [Op.in]: commentRestaurantId
            }
          }

        }).then(commentedRestaurants => {

          return res.render('profile', {
            user,
            commentedRestaurants,
            restaurantAmount: commentRestaurantId.length,
            favoritedRestaurants: req.user.FavoritedRestaurants,
            favoritedAmount: req.user.FavoritedRestaurants.map(item => item.RestaurantId).length,
            followingAmount: req.user.Followings.map(i => i.FollowingId).length,
            followerAmount: req.user.Followers.map(i => i.FollwerId).length,
            isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
            operateUserId: req.user.id
          })

        })

      })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('editProfile', { user })
      })
  },
  putUser: (req, res) => {

    if (!req.body.name) {
      req.flash('error_messages', "Name didn't exist")
      return res.redirect('back')
    }
    if (!req.body.name) {
      req.flash('error_messages', "Email didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user.update({
              name: req.body.name,
              email: req.body.email,
              image: file ? img.data.link : user.image
            })
            .then(user => {
              req.flash('success_messages', 'User was successfully to update')
              res.redirect(`/users/${req.params.id}`)
            })
        })
      })

    } else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
            name: req.body.name,
            email: req.body.email,
            image: user.image
          })
          .then(user => {
            req.flash('success_messages', 'User was successfully to update')
            res.redirect(`/users/${req.params.id}`)
          })
      })
    }
  },
  getTopUser: (req, res) => {
    // get all user and follower's data
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      // map users data
      users = users.map(user => ({
        ...user.dataValues,
        // count follower numbers
        FollowerCount: user.Followers.length,
        // check user is followed or not
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      // sort by followerCount
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', {
        users,
        operateUserId: req.user.id
      })
    })
  },
  addFollowing: (req, res) => {
    return Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
      .then(followship => {
        return res.redirect('back')
      })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
      .then(followship => {
        followship.destroy()
          .then(followship => {
            return res.redirect('back')
          })
      })
  }

}

module.exports = userController