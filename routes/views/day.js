const keystone = require('keystone')


exports = module.exports = function(req, res) {
  let view = new keystone.View(req, res)

  let locals = res.locals
  locals.section = 'home'

  if (!req.params.day || !(1 <= +req.params.day && +req.params.day <= 11)) {
    return res.status(404).send()
  }

  console.log('params: ', req.params)

  locals.data = {
    day : +req.params['day'],
    movies : []
  }


  view.on('init', function(next) {
    keystone.list('Movie').model
      .find()
      .where({'screenTime.year' : 2017})
      .where({'screenTime.day' : req.params['day']})
      .exec(function(err, docs) {
        locals.data.movies = docs
        console.log('executed query for day ' + req.params.day)
        console.log('found ' + docs.length + " documents" )
        next(err)
      })
  })


  view.render('day')
}