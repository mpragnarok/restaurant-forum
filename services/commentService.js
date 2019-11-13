const db = require('../models'),
  Comment = db.Comment
let commentService = {
  postComment: (req, res, callback) => {
    const { text, restaurantId } = req.body
    return Comment.create({
      text,
      RestaurantId: restaurantId,
      UserId: req.user.id
    }).then((comment) => callback({ status: 'success', message: '', comment }))
  },
  deleteComment: (req, res, callback) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        callback({ status: 'success', message: '', comment })
        comment.destroy()
      })
  }
}

module.exports = commentService