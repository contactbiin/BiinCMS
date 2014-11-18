module.exports =function(){
	var functions ={};

	functions.getCategories=function(req,res){
		var jsonVariable={
					    "data": {
					        "categories": [
					            {
					                "identifier": "MyBiins",
					                "sites": [
					                    {
					                        "identifier": "iConSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/iConSite01.json"
					                    },
					                    {
					                        "identifier": "converseSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/converseSite01.json"
					                    },
					                    {
					                        "identifier": "nokiaSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/nokiaSite01.json"
					                    },
					                    {
					                        "identifier": "xboxSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/xboxSite01.json"
					                    },
					                    {
					                        "identifier": "tonysSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/tonysSite01.json"
					                    },
					                    {
					                        "identifier": "matutesSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/matutesSite01.json"
					                    }
					                ]
					            },
					            {
					                "identifier": "Technology",
					                "sites": [
					                    {
					                        "identifier": "iConSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/iConSite01.json"
					                    },
					                    {
					                        "identifier": "samsungSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/samsungSite01.json"
					                    },
					                    {
					                        "identifier": "nokiaSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/nokiaSite01.json"
					                    },
					                    {
					                        "identifier": "playSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/playSite01.json"
					                    },
					                    {
					                        "identifier": "xboxSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/xboxSite01.json"
					                    }
					                ]
					            },
					            {
					                "identifier": "Shoes",
					                "sites": [
					                    {
					                        "identifier": "flexySite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/flexySite01.json"
					                    },
					                    {
					                        "identifier": "converseSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/converseSite01.json"
					                    },
					                    {
					                        "identifier": "adidasSite01",
					                        "jsonUrl": "http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/adidasSite01.json"
					                    },
					                    {
					                        "identifier": "nikeSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/nikeSite01.json"
					                    },
					                    {
					                        "identifier": "pumaSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/pumaSite01.json"
					                    }
					                ]
					            },
					            {
					                "identifier": "Food",
					                "sites": [
					                    {
					                        "identifier": "spoonSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/spoonSite01.json"
					                    },
					                    {
					                        "identifier": "antoniosSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/antoniosSite01.json"
					                    },
					                    {
					                        "identifier": "matutesSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/matutesSite01.json"
					                    },
					                    {
					                        "identifier": "tonysSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/tonysSite01.json"
					                    },
					                    {
					                        "identifier": "joesSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/joesSite01.json"
					                    },
					                    {
					                        "identifier": "tastyChickenSite01",
					                        "jsonUrl":"http://s3-us-west-2.amazonaws.com/biintest/BiinFakeJsons/sites/tastyChickenSite01.json"
					                    }
					                ]
					            }
					        ]
					    }
					};
		return res.json(jsonVariable);
	}

	functions.getRegions=function(req,res){
		var jsonVariable={
			    "data":
			    {   
			        "regions": 
			        [
			            {"_id":"536ade3a3f432e129809935c","identifier":"bnOffice","latitude":"9.752026","longitude":"-84.010981","radious":"300"},
			            {"_id":"536ade3a3f432e129809935d","identifier":"bnHome","latitude":"9.748415","longitude":"-84.029094","radious":"300"},
			            {"_id":"536ade3a3f432e129809935e","identifier":"bnFrailes","latitude":"9.750654","longitude":"-84.053741","radious":"400"},
			            {"_id":"536ade3a3f432e129809935f","identifier":"bnTerranova","latitude":"9.748029","longitude":"-83.999894","radious":"300"},
			            {"_id":"536ade3b3f432e1298099360","identifier":"bnSierra","latitude":"9.744862","longitude":"-83.986342","radious":"600"},
			            {"_id":"536c48629228bc020009206b","identifier":"bnLaPaz","latitude":"9.748870","longitude":"-83.977433","radious":"200"},
			            {"_id":"536c48e29228bc020009206c","identifier":"bnTorresEolicas","latitude":"9.757773","longitude":" -83.978088","radious":"500"},
			            {"_id":"536c49229228bc020009206d","identifier":"bnCasamata","latitude":"9.778108","longitude":"-83.991451","radious":"1000"},
			            {"_id":"536c49789228bc020009206e","identifier":"bnPalmital","latitude":"9.795215","longitude":" -83.968169","radious":"1000"},
			            {"_id":"536c4a009228bc020009206f","identifier":"bnSanIsidro","latitude":"9.827713","longitude":"-83.951922","radious":"500"},
			            {"_id":"536c523633cbf702003aca3b","identifier":"bnElTejardelGuarco","latitude":"9.844230","longitude":" -83.938071","radious":"200"},
			            {"_id":"536c52b433cbf702003aca3c","identifier":"bnElCerdito","latitude":"9.847761","longitude":"-83.936247","radious":"100"},
			            {"_id":"536c535033cbf702003aca3d","identifier":"bnLaEstrella","latitude":"9.796588","longitude":"-83.945630","radious":"400"},
			            {"_id":"536c539033cbf702003aca3e","identifier":"bnVueltaElTonto","latitude":"9.791013","longitude":"-83.953405","radious":"200"},
			            {"_id":"536c541b33cbf702003aca3f","identifier":"bnMasajes","latitude":"9.808896","longitude":"-83.954355","radious":"200"},
			            {"_id":"536c546033cbf702003aca40","identifier":"bnElQuijongo","latitude":"9.842561","longitude":"-83.950617","radious":"300"},
			            {"_id":"536c549033cbf702003aca41","identifier":"bnElMolino","latitude":"9.860306","longitude":" -83.931075","radious":"300"},
			            {"_id":"536c54d633cbf702003aca42","identifier":"bnRiddhi","latitude":"9.864458","longitude":"-83.923009","radious":"200"}
			        ]
			    }
			}
			return res.json(jsonVariable);
	}
	return functions;
}