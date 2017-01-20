const keystone = require('keystone')

exports = module.exports = function(req, res) {
  let view = new keystone.View(req, res)
  let locals = res.locals

  locals.section = 'partners'

  view.on('init', next => {
    keystone.list('Content').model.findOne()
      .where({'title':'Partners'})
      .exec(function(err, doc) {
        if (doc) locals.data = doc.content
        next(err)
      })
  })

  view.render('partners')
}