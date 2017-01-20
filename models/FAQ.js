const keystone = require('keystone')
const Types    = keystone.Field.Types


const FAQ = new keystone.List('FAQ')

FAQ.add({
  content : {
    type : Types.Html, wysiwyg : true, height: 150
  },
  createdOn : { type : Types.Date, default: Date.now }
})


FAQ.register()