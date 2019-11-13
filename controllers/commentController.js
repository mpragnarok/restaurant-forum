const commentService = require('../services/commentService')
let commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, (data) => res.redirect(`/restaurants/${data.comment.RestaurantId}`))
  },
  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, (data) => res.redirect(`/restaurants/${data.comment.RestaurantId}`))
  }
}

module.exports = commentController