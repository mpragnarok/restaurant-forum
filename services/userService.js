const bcrypt = require('bcrypt-nodejs')
const db = require('../models'),
  User = db.User

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

}

module.exports = userController