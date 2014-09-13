
var path = require("path"), uuid=require('node-uuid'),
  fs = require('fs'),
  util = require('util'),
  //FTP Package
  ftp = require("ftp");
  var ftpConn = new ftp();

module.exports = function(){
	var functions={};
    
    //Get a random UIID
    functions.getGUID = function(){
     return uuid.v4();
    }

    //Get the extension of a file
    functions.getExtension= function(filename) {
       var ext = path.extname(filename||'').split('.');
       return ext[ext.length - 1];
    }
    
    //Return a new name for an image
    functions.getImageName=function(filename,toPath){
      var extension= this.getExtension(filename);
      var newName = this.getGUID()+"."+extension;
      newName = newName.replace("-","");
       //Verify if the image all ready exists       
       /*fs.exists(path.join(filename,filename),function(exists){
         if(!exists){
            return  newName;
         }else{
         	//Call again to try get a new image name
         	return this.getImageName(filename,toPath);
         }
       });*/
      return newName;
    }

   //Misselanious Properties
    functions.get ={};

    functions.get.majorIncrement =function(){
      return 10;
    }

    functions.get.minorIncrement =function(){
      return 10;
    }

    return functions;	
}