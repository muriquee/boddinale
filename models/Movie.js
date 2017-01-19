const keystone = require('keystone')
const Types    = keystone.Field.Types


const Movie = new keystone.List('Movie', {
  map     : { name: 'title' },
	autokey : { path: 'slug', from: 'title', unique: true },
})

Movie.add({
  title : { 
    type : Types.Text, required: true, index: true
  },
  director : { 
    name : { type : Types.Text },
    href : { type : Types.Url  }
  },
  description : {
    type: Types.Html, wysiwyg: true, height: 400
	},
  length : {
    type : Types.Number
  },
  screenTime : {
    year     : { type : Types.Number, index: true },
    day      : { type : Types.Number, index: true },
    position : { type : Types.Number, index: true, label : 'slot' }
  },
  display : {
    image    : { type : Types.CloudinaryImage },
    youtube  : { type : Types.Url },
    vimeo    : { type : Types.Url }
  },
  externalLink : {
    type : Types.Url
  },
  category : {
    type : Types.Select,
    options : ['Short', 'Feature', 'Music Video', 'Animation', 'Documentary']
  },
  award : {
    type : Types.Select,
    options : ['Community Award', 'Loophole Award', 'Best Documentary', 
      'Best Short', 'Best Feature', 'Best Animation', 'Best Music Video', 
      'Special Mention of the Jury', 'Special Mention of the Loophole',
      'Independant Life Award']
  }
})


Movie.schema.virtual('description.full').get(function() {
  return this.description.extended || this.description.brief
})

Movie.defaultColumns = 'title, director|20%, screenTime.year|20%, screenTime.day|20%'

Movie.register()

