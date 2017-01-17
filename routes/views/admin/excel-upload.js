var keystone = require('keystone')
var fs = require('fs')

var excel2json = require('excel-to-json')

const path = __dirname + "/../../../uploads/"

function convertToJSON (f) {
  excel2json({
    input: path,  // input directory  
    output: path  // output directory  
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
}

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res)

  view.on('post', {action : 'excel-upload'}, function(next) {
    let f = path + "test.jpg"
    let reader = fs.createReadStream(req.files.excel.path)
    reader.pipe(fs.createWriteStream(path))
    reader.on('finish', function() {
      console.log('finished uploading')
      convertToJSON(f)
    })
    next(null)
  })  

  view.render('admin/excel-upload')
}