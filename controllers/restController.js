const db = require('../models'),
  Restaurant = db.Restaurant,
  Category = db.Category,
  Comment = db.Comment,
  User = db.User,
  Like = db.Like,
  Favorite = db.Favorite
const restService = require('../services/restService')
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => res.render('restaurants', data))
    // let offset = 0
    // let whereQuery = {}
    // let categoryId = ''
    // if (req.query.page) {
    //   offset = (req.query.page - 1) * pageLimit
    // }
    // if (req.query.categoryId) {
    //   categoryId = Number(req.query.categoryId)
    //   whereQuery['CategoryId'] = categoryId
    // }
    // Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset, limit: pageLimit }).then(result => {
    //   // data for pagination
    //   let page = Number(req.query.page) || 1
    //   let pages = Math.ceil(result.count / pageLimit)
    //   let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)

    //   let prev = page - 1 < 1 ? 1 : page - 1
    //   let next = page + 1 > pages ? pages : page + 1
    //   // clean up restaurant data
    //   const data = result.rows.map(r => ({
    //     ...r.dataValues,
    //     description: r.dataValues.description.substring(0, 50),
    //     isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
    //     isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
    //   }))
    //   Category.findAll().then(categories => {
    //     return res.render('restaurants', {
    //       restaurants: data,
    //       categories,
    //       categoryId,
    //       page,
    //       totalPage,
    //       prev,
    //       next
    //     })
    //   })

    // })
  },
  getRestaurant: (req, res) => {
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
      return res.render('restaurant', {
        restaurant,
        isFavorited,
        isLiked
      })
    })
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => {
      return res.render('feeds', data)
    })
  },
  getDashboard: (req, res) => {
    return Comment.findAndCountAll({
      where: {
        'RestaurantId': req.params.id
      }
    }).then(comments => {

      Restaurant.findByPk(req.params.id, { include: [Category] })
        .then(restaurant => {
          return res.render('dashboard', {
            restaurant,
            commentCount: comments.count
          })
        })
    })
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  getTop10Restaurants: (req, res) => {
    restService.getTop10Restaurants(req, res, (data) => {
      return res.render('topRestaurants', data)
    })
  }
}
module.exports = restController