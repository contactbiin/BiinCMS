var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var siteObj ={
	identifier:{type:String, default:"-1", index:true},
	accountIdentifier:{type:String, default:"000"},
	organizationIdentifier:{type:String,default:""},
	majorCounter:{type:Number,default:0},
	name: {type:String, default:""},
	title1:{type:String, default:""},
	colorTitle1:{type:String,default:""},
	title2:{type:String, default:""},	
	colorTitle2:{type:String,default:""},
	title3:{type:String, default:""},	
	description: {type:String, default:""},
	major:{type: Number, default:0},
	minorCounter:{type: Number, default:0},
	searchTags:[],
	categories:[
		{
			identifier:{type:String, index:true, default:"-1"},
			name:{type:String, default:""},
			displayName:{type:String, default:""},
			imgUrl:{type:String, default:""}
		}
	],
	media:[
		{
			identifier:{type:String, default:""},
			title1:{type:String, default:""},
			imgUrl:{type:String,default:""}
		}
	],
	biins:[
		{
			identifier:{type:String, index:true, Default:""},
			name:{type:String, Default:""},
			major:{type:String, Default:""},
			minor:{type:String, Default:""},
			proximityUUID:{type:String, Default:""},
			location:{type:String, Default:""},
			registerDate:{type:String, Default:""},
			showcaseAsigned:{type:String, Default:""}
		}
	]
}
var siteSchema = new Schema(siteObj);

module.exports = mongoose.model('sites', siteSchema);