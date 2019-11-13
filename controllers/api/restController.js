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

  getTop10Restaurants: (req, res) => {
    restService.getTop10Restaurants(req, res, (data) => res.json(data))
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => res.json(data))
  }
}
module.exports = restController