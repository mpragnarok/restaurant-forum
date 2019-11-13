const db = require('../../models'),
  Restaurant = db.Restaurant,
  Category = db.Category,
  Comment = db.Comment,
  User = db.User,
  Like = db.Like,
  Favorite = db.Favorite
const restService = require('../../services/restService')
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => res.json(data))
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => res.json(data))
  },
  getTop10Restaurants: (req, res) => {
    restService.getTop10Restaurants(req, res, (data) => res.json(data))
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => res.json(data))
  },
  getDashboard: (req, res) => {
    restService.getDashboard(req, res, (data) => res.json(data))
  },
  addLike: (req, res) => {
    restService.addLike(req, res, (data) => res.json(data))
  },
  removeLike: (req, res) => {
    restService.removeLike(req, res, (data) => res.json(data))
  }
}
module.exports = restController