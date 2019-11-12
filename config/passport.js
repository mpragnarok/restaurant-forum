const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant


// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    // remain req for req.flash
    passReqToCallback: true
  },
  // authenticate user
  // pass req
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', 'That email is not registered'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', 'Email or password incorrect'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: db.Restaurant, as: 'FavoritedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: db.Restaurant, as: 'LikedRestaurants' }
    ]
  }).then(user => {
    return cb(null, user)
  })
})

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: db.Restaurant, as: 'FavoritedRestaurants' },
      { model: db.Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)

module.exports = passport