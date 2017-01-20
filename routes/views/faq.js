const keystone = require('keystone')

exports = module.exports = (req, res) => {
  let view = new keystone.View(req, res)

  view.on('init', next => {
    console.log('TODO')
    next()
  })

  view.render('faq')
}