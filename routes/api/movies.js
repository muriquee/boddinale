const keystone = require('keystone')

exports = module.exports = (req, res) => {
  let query = keystone.list('Movie').model.find()
  
  if (req.query) {
    quer.where(req.query)
  }

  query.exec((err, docs) => {
    if (err) {
      return res.sendStatus(500)
    }
    return res.status(200).json(docs)
  })

}