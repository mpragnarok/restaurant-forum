
const db = require('../models'),
  Category = db.Category

const categoryService = {

  getCategories: (req, res, callback) => {

    return Category.findAll()
      .then(categories => {
        if (req.params.id) {
          Category.findByPk(req.params.id).then(category => {
            callback({ categories, category })
          })
        } else {
          callback({ categories })
        }
      })
  },
  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: 'Name didn\'t exist' })
    } else {
      return Category.create({
        name: req.body.name
      })
        .then(() => callback({ status: 'success', message: 'Add category successfully' }))
    }
  },
  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: 'Name didn\'t exist' })
    } else {
      return Category.findByPk(req.params.id)
        .then(category => category.update(req.body))
        .then(() => callback({ status: 'success', message: 'Update category successfully' }))
    }
  },
  deleteCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then(category => category.destroy())
      .then(() => callback({ status: 'success', message: '' }))
      .catch(e => callback({ status: 'error', message: '' }))
  }
}

module.exports = categoryService