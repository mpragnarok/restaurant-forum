const db = require('../models'),
  Restaurant = db.Restaurant,
  Category = db.Category,
  Comment = db.Comment,
  User = db.User,
  Like = db.Like,
  Favorite = db.Favorite

const pageLimit = 10

const restService = {
  getRestaurants: (req, res, callback) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset, limit: pageLimit }).then(result => {
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)

      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description ? r.dataValues.description.substring(0, 50) : '',
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll().then(categories => {
        callback({
          restaurants: data,
          categories,
          categoryId,
          page,
          totalPage,
          prev,
          next
        })
      })

    })
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        // Nested eager loading
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      restaurant.update({
        viewCount: restaurant.viewCount ? restaurant.viewCount + 1 : 1
      })
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      callback({
        restaurant,
        isFavorited,
        isLiked
      })
    })
  },

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
  },
  getDashboard: (req, res, callback) => {
    return Comment.findAndCountAll({
      where: {
        'RestaurantId': req.params.id
      }
    }).then(comments => {
      Restaurant.findByPk(req.params.id, { include: [Category] })
        .then(restaurant => {
          callback({
            restaurant,
            commentCount: comments.count
          })
        })
    })
  }
}
module.exports = restService