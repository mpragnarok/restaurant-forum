const restService = require('../services/restService')


const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => res.render('restaurants', data))
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => res.render('restaurant', data))
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => {
      return res.render('feeds', data)
    })
  },
  getDashboard: (req, res) => {
    restService.getDashboard(req, res, (data) => res.render('dashboard', data))
  },
  addLike: (req, res) => {
    restService.addLike(req, res, (data) => res.redirect('back'))
  },
  removeLike: (req, res) => {
    restService.removeLike(req, res, (data) => res.redirect('back'))
  },
  getTop10Restaurants: (req, res) => {
    restService.getTop10Restaurants(req, res, (data) => {
      return res.render('topRestaurants', data)
    })
  }
}
module.exports = restController