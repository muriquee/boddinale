const keystone = require('keystone')
const fs       = require('fs')
const path     = require('path')
const dataPath = path.join(__dirname, "/../../../uploads/data.json")

const Movie = keystone.list('Movie').model

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const categories = ['Short', 'Feature', 'Music Video', 'Animation', 'Documentary']

function getIdFromYoutube(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error converting youtube link';
    }
}

function convertYoutubeToEmbed (id) {
  return "https://www.youtube.com/embed/" + id
}

function isYoutube (url) {
  return url.indexOf('yout') != -1
}

function isVimeo (url) {
  return url.indexOf('vimeo') != -1
}

function convertVimeoToEmbed(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(\S+)/g;
  if (pattern.test(input)) {
   var replacement = '//player.vimeo.com/video/$1';
   var input = input.replace(pattern, replacement);
  }
  return input;
}

function isGMailLink (url) {
  return url.indexOf('mail.google') != -1
}

function insertData (year, callback) {
  fs.readFile(dataPath, 'utf-8', (err, data) => {
    if (err) return callback(err)
    let moviesJSON = JSON.parse(data)['data']
    moviesJSON.forEach(movie => {
      let mdb = new Movie()
      mdb.set({
        title : movie['title'],
        length : movie['length'],
        description : movie['description'],
        director : {
          name : movie['director'],
          href : movie['director link']
        },
        screenTime : {
          year : year,
          day  : movie['day'],
          position : movie['slot']
        },
        externalLink : isGMailLink(movie['movie link']) ? '' : movie['movie link']
      })
      let category = (movie['category'].split(' ')[1] || '').toLowerCase().capitalize()
      console.log("category", category)
      if (categories.indexOf(category) !=- 1){
        mdb.set({
          category : category
        })
      }
      if (isYoutube(movie['trailer'])) {
        mdb.set({
          display : {
            youtube : convertYoutubeToEmbed(getIdFromYoutube(movie['trailer']))
          }
        })
      }
      else if (isVimeo(movie['trailer'])) {
        mdb.set({
          display : {
            vimeo : convertVimeoToEmbed(movie['trailer'])
          }
        })
      }
      mdb.save((err,doc) => console.log(err))
    })
    callback(null)
  })
}

exports = module.exports = (req, res) => {
  let view = new keystone.View(req, res)


  view.on('post', {action : 'upload' }, next => {
    let year = req.body.year
    console.log('year: ', year)
    let movies = req.files['movies']
    if (movies.extension != 'json') {
      res.json({'error':'file must have .json extension'})
      return next()
    }
    let reader = fs.createReadStream(movies.path)
    let writer = fs.createWriteStream(dataPath)
    reader.pipe(writer).on('finish', () => {
      console.log('reader finished!')
      insertData(+year, (err) => {
        if (err) {
          return res.json(err)
        }
        next()
      })
    })
  })

  view.render('admin/upload')
}