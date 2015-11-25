//Mobile User Session
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mobileUserSchema=new Schema({
	identifier:{type:String,index:true},
  sitesSent:[
    {identifier:{type:String}}
  ],
  elementsSent:[
    {identifier:{type:String}}
  ],
  organizatonsSent:[
    {identifier:{type:String}}
  ],
  elementsAvailable:[
    {
      identifier:{type:String},
      categories:[
        {identifier:{type:String}}
      ]
    }
  ],
  lastrequest:{type:Date}
});

module.exports = mongoose.model('mobileSession', mobileUserSchema);