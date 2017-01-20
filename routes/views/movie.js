const keystone = require('keystone')

exports = module.exports = function(req, res) {
  let view = new keystone.View(req, res)
  let locals = res.locals

  locals.section = 'movie'

  locals.data = {}


  view.on('init', function(next) {
    keystone.list('Movie').model
      .findOne({'slug' : req.params.slug })
      .exec(function(err, doc) {
        locals.data = { movie : doc }
        next(err)
      })
  })

  view.render('movie')
}