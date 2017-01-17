const keystone = require('keystone')


exports = module.exports = function(req, res) {
  let view = new keystone.View(req, res)
  let locals = res.locals

  locals.section = 'press'

  view.render('press')
}