module.exports = function () {
	var functions = {};
	
	//Get the index page
	functions.index = function(req, res){
	  res.render('index', { title: 'Express' });
	};

	//Get the Login
	functions.login = function (req,res) {
		res.render('login',{title:'login'});
	};

	//Get the dashboard
	functions.dashboard = function (req,res) {
		if(req.session.passport.user==undefined){
			res.redirect('/login');
		}else{
			res.render('homeDashboard',{title:'Welcome!',				
			 user:req.user});
		}
	};

	//Get the partial views for use with angular
	functions.partials = function(req, res){
	  var filename = req.params.filename;
	  if(!filename) return;  // might want to change this
	  console.log("_partials/" + filename);
	  res.render("_partials/" + filename );
	}
	
	return functions;
};