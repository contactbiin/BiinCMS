//Mobile User or Binnie
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Define the validations for an organization
var validations={
	required :['firstName','lastName','biinName','birthDate','gender'],
	len :[
			{field:'firstName',min:3,max:40},
			{field:'lastName',min:3,max:40},
			{field:'biinName',min:3,max:40},
			{field:'birthDate',min:3,max:40},
			{field:'gender',min:3,max:40},
			{field:'password',min:6,max:20}
		],
	email:['biinName']
};

var mobileUserSchema=new Schema({
	identifier:{type:String,index:true},
	firstName: String,
	lastName:String,
	biinName:String,
	password:String,
	birthDate:String,
	gender:String,
	joinDate:String,
	leftDate:String,
	accountState:{type:Boolean, default:false},
	thirdPartyAccounts:[{
		type:String,
		accountIdentifier:String,
		email:String,
		token:String,
		RefreshToken:String,
		expireDate:String,
	}],
	imgUrl:{type:String, default:""},
	comments:String,
	userBiined:String,
	userCommented:String,
	userShared:String,
	//Activity of the user in the app
	actvityHistory:[],
	categories:[
			{
				identifier:{type:String, index:true, default:"-1"},
				name:{type:String, default:""},
				displayName:{type:String, default:""},
				url:{type:String, default:""}
			}
	]
});

//Methods

mobileUserSchema.methods.validations = function() {
	return validations;
};
module.exports = mongoose.model('mobileUsers', mobileUserSchema);
