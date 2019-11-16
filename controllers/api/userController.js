const bcrypt = require('bcrypt-nodejs')
const db = require('../../models'),
  User = db.User
const userService = require('../../services/userService.js')
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signIn: (req, res) => {
    const { email, password } = req.body
    // check necessary data
    if (!email || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // check user existing and password correction
    User.findOne({ where: { email } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }

      // sign token
      let payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    })
  },
  signUp: (req, res) => {
    const { passwordCheck, password, email, name } = req.body
    if (password !== passwordCheck) {
      return res.json({ status: 'error', message: 'Passwords are not the same' })
    } else {
      User.findOne({ where: { email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: 'This Email is already registered' })
        } else {
          User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: 'Register successfully!' })
          })
        }
      })
    }
  },
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => res.json(data))
  }
}

module.exports = userController