const db = require('../models'),
  Comment = db.Comment
let commentController = {
  postComment: (req, res) => {
    const { text, restaurantId } = req.body
    return Comment.create({
      text,
      Restaurant: restaurantId,
      UserId: req.user.id
    }).then(comment => {
      res.redirect(`/restaurants/${restaurantId}`)
    })
  }
}

module.exports = commentController