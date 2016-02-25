var express = require('express');
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var passport = require('passport');
var passportLocal = require('passport-local');

var app = express();


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false }));
app.use(cookieParser());
app.use(expressSession({ 
	secret:process.env.SESSION_SECRET || 'secret',
	resave:false,
	saveUninitialized: false
 }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(function(username,password,done){
// Thus would allow us to invoke the function using on of these options below
// done(null, user);
// done(null,null);
// done(new Error('eish'));
// so on this case we are going to use our database to verify our user information by using conditional statements
	// note that here we are going to pretend as if we are using database 
	if (username === password) {
		//since I have not created a real DB Im going to use username as my id but on your app you gonna have to use appropriate values
		done(null, { id:username, name: username});
	}else{
		// note this will be the result of the failing validation and this is how we tell passport that the validation has failed
 		done(null,null); 
	 } 
}))

// now passport will require us to specify someway or return that object into a momentum and we will have to this:
passport.serializeUser(function (user, done){
	done(null, user.id)
})
// for when the user comes back this would be sueful
passport.deserializeUser(function (id, done){
	// query database or cache here and this will some database call example
	done(null,{id: id, name: id})
});

app.get("/", function (req,res) {
    res.render("home",{
    	isAuthenticated: req.isAuthenticated(),
    	user:req.user
    })
})

app.get("/login", function (req,res) {
    res.render("login");
});
app.post("/login",passport.authenticate('local'),function (req,res){	
	res.redirect('/')
}) 
var port = process.env.port || 2000;

app.listen( port, function(){
  console.log('listening on *:' + port);
});   