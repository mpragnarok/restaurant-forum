const db = require('../models'),
  Restaurant = db.Restaurant,
  Category = db.Category,
  Comment = db.Comment,
  User = db.User,
  Like = db.Like,
  Favorite = db.Favorite

const pageLimit = 10

const restService = {

  getTop10Restaurants: (req, res, callback) => {
    // get all user and follower's data
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurants => {
      // map restaurants data
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.dataValues.description ? restaurant.dataValues.description.substring(0, 50) : '',
        // count follower numbers
        FavoriteCount: restaurant.FavoritedUsers.length,
        // check user is followed or not
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(restaurant.id)
      }))
      // sort by followerCount and splice top 10
      restaurants = restaurants.sort().splice(0, 10)
      callback({ restaurants })
    })
  },
  getFeeds: (req, res, callback) => {
    return Restaurant.findAll({
      limit: 10,
      order: [
        ['createdAt', 'DESC']
      ],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        order: [
          ['createdAt', 'DESC']
        ],
        include: [User, Restaurant]
      }).then(comments => {
        callback({ restaurants, comments })
      })
    })
  }
}
module.exports = restService