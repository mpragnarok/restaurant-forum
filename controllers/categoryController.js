const categoryService = require('../services/categoryService')
let categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => res.render('admin/categories', data))
  },
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
      } else {
        req.flash('success_messages', data['message'])
        res.redirect('/admin/categories')
      }
    })
  },
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
      } else {
        req.flash('success_messages', data['message'])
        res.redirect('/admin/categories')
      }
    })
  },
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => res.redirect('/admin/categories'))
  }
}

module.exports = categoryController