const db = require('../models'),
  Restaurant = db.Restaurant,
  Category = db.Category,
  Comment = db.Comment,
  User = db.User
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
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
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll().then(categories => {
        return res.render('restaurants', {
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
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        // Nested eager loading
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      restaurant.update({
        viewCount: restaurant.viewCount ? restaurant.viewCount + 1 : 1
      })
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      return res.render('restaurant', {
        restaurant,
        isFavorited
      })
    })
  },
  getFeeds: (req, res) => {
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
        return res.render('feeds', {
          restaurants,
          comments
        })
      })
    })
  },
  getDashboard: (req, res) => {
    return Comment.findAndCountAll({
      where: {
        'RestaurantId': req.params.id
      }
    }).then(comments => {
      console.log()
      Restaurant.findByPk(req.params.id, { include: [Category] })
        .then(restaurant => {
          return res.render('dashboard', {
            restaurant,
            commentCount: comments.count
          })
        })
    })

  }
}
module.exports = restController