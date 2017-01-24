const keystone = require('keystone')


const awards = ['Community Award', 'Loophole Award', 'Best Documentary',
      'Best Short', 'Best Feature', 'Best Animation', 'Best Music Video',
      'Special Mention of the Jury', 'Special Mention of the Loophole',
      'Independant Life Award']

const categories = ['Short', 'Feature', 'Music Video', 'Animation', 'Documentary']

exports = module.exports = function(req, res) {
  const view = new keystone.View(req, res)
  const locals = res.locals

  locals.section = 'archive'

  locals.data = {
    movies : [],
    query : req.query,
    years : [2013,2014,2015,2016,2017],
    awards : awards,
    categories : categories
  }

  locals.qStrForPage = function(i) {
    let res = []
    if (req.query.y) res.push(`y=${req.query.y}`)
    if (req.query.d) res.push(`d=${req.query.d}`)
    if (req.query.q) res.push(`q=${req.query.q}`)
    if (req.query.a) res.push(`a=${req.query.a}`)
    if (req.query.c) res.push(`c=${req.query.c}`)
    res.push(`page=${i}`)
    return '?' + res.join('&')
  }

  view.on('init', function(next) {
    console.log('Movie view init')
    const query = keystone.list('Movie').paginate({
			page: req.query.page || 1,
			perPage: 12,
			maxPages: 10
		})
    .sort({
      'screenTime.year'     : 1,
      'screenTime.day'      : 1,
      'screenTime.position' : 1
    })

    if (req.query.y) {
      query.where({ 'screenTime.year' : +req.query.y })
    }
    if (req.query.d) {
      query.where({ 'screenTime.day' : +req.query.d })
    }
    if (req.query.q) {
      let regex = new RegExp(req.query.q, 'i')
      query.or([{'title' : regex}, {'director.name' : regex }])
    }
    if (req.query.a) {
      query.where({'award' : req.query.a })
    }
    if (req.query.c) {
      query.where({'category' : req.query.c })
    }

    query.exec(function(err, docs) {
      docs.forEach(d => d.format())
      locals.data.movies = docs
      next(err)
    })

  })

  view.render('archive')
}
