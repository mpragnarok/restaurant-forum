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

  getTop10Restaurants: (req, res) => {
    restService.getTop10Restaurants(req, res, (data) => {
      return res.json(data)
    })
  },
}
module.exports = restController