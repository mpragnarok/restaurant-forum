const bcrypt = require('bcrypt-nodejs')
const db = require('../models'),
  User = db.User,
  Comment = db.Comment,
  Favorite = db.Favorite,
  Restaurant = db.Restaurant,
  Followship = db.Followship
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  getTopUser: (req, res, callback) => {
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
      callback({
        users,
        operateUserId: req.user.id
      })
    })
  },
  getUser: (req, res, callback) => {
    return User.findByPk(req.params.id, {
      include: [
        Comment,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Restaurant, as: 'FavoritedRestaurants' }
      ]
    })
      .then(user => {
        // Remove duplicated restaurantId from  commentRestaurantIds array
        const commentRestaurantIds = [...new Set(user.dataValues.Comments.map(item => item.RestaurantId))]
        Restaurant.findAll({
          where: {
            id: {
              [Op.in]: commentRestaurantIds
            }
          }

        }).then(commentedRestaurants => {
          callback({
            userData: user,
            commentedRestaurants,
            restaurantAmount: commentRestaurantIds.length,
            favoritedRestaurants: user.FavoritedRestaurants,
            favoritedAmount: user.FavoritedRestaurants.map(item => item.RestaurantId).length,
            followingAmount: user.Followings.length,
            followerAmount: user.Followers.length,
            isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
            operateUserId: req.user.id
          })
        })

      })
  },
  putUser: (req, res, callback) => {
    if (req.params.id === req.user.id || req.user.isAdmin) {
      if (!req.body.name) {
        callback({
          status: 'error', message: "Name didn't exist"
        })
      }
      if (!req.body.email) {
        callback({
          status: 'error', message: "Email didn't exist"
        })
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
                callback({
                  status: 'success', message: "User was successfully to update"
                  , id: req.params.id
                })
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
              callback({
                status: 'success', message: "User was successfully to update", id: req.params.id
              })
            })
        })
      }
    } else {
      callback({
        status: 'error', message: "permission denied"
      })
    }
  },
  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then(() => callback({ status: 'success', message: '' }))
      .catch(e => callback({ status: 'error', message: '' }))
  },
  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => followship.destroy())
      .then(() => callback({ status: 'success', message: '' }))
      .catch(e => callback({ status: 'error', message: '' }))
  }
}

module.exports = userController