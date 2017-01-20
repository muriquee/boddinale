const keystone = require('keystone')

exports = module.exports = (req, res) => {
  let view = new keystone.View(req, res)

  let locals = res.locals
  locals.data = {
    faqs : []
  }

  locals.section = 'faq'

  view.on('init', next => {
    const query = keystone.list('FAQ').paginate({
      page: req.query.page || 1,
      perPage: 10,
      maxPages: 10
    })
    .sort({
      'createdOn' : 1
    })

    query.exec(function(err, docs) {
      locals.data.faqs = docs
      next(err)
    })
  })

  view.render('faq')
}