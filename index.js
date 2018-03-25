var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var app = express();

//Database Connection
mongoose.connect('mongodb://princebatra:prince@ds223509.mlab.com:23509/workshop');
app.use(bodyParser.urlencoded({ extended: false }))
 
 //Database Setup

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function() {         
      // we're connected!
      console.log("Connected To MongoLab Cloud Database :p");
}); 

//Schema Setup
var urlSchema = mongoose.Schema({
    longurl: String,
    customurl: String
});

//Model Setup
var Url = mongoose.model('Url', urlSchema);


// parse application/json
app.use(bodyParser.json())

console.log(__dirname);
console.log("prince");
app.get('/',function(req,res){
	res.sendfile(__dirname+'/show.html');
})

app.get('/about',function(req,res){
	res.send('My About Us');
})

app.get('/contact',function(req,res){
	res.send('My Contact Us');
})
app.get('/profile/:username',function(req,res){
	res.send("Hi! "+ req.params.username);
})

var urlArray=[];
var keyArray=[];
app.post('/short',function(req,res){
    var user_url=req.body.longurl;
    var custom_url=req.body.customurl;
    console.log(user_url+" "+custom_url);

   var newUrl = new Url({ longurl: user_url,customurl: custom_url});
  console.log(newUrl.url+'\n '+newUrl.key+'\n');

newUrl.save(function (err, data) {
  if (err) return console.error(err);
  console.log("Short Url Created!!"+data);
});
res.send("Created!!");
})


app.get("/:custom_url",function(req,res){
	var user_key=req.params.customurl;
	Url.findOne({key:user_key},function(err,data){
		if(err) console.error(err);
		console.log(data);
		res.redirect(data.longurl);
	})
})
app.get('/*',function(req,res){
	res.send('404 error');
})
app.listen('3000');