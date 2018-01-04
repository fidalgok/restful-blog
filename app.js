var express = require('express');
var app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

//App config 
mongoose.connect('mongodb://localhost/restful_blog_app');
app.set("view engine", "ejs");
//tells express to look at the public directory for files
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//this line will help us stick to convention by overriding the method
//used on an html form. Because html forms only allow for get and post
//requests we need to trick it into using PUT for our update route. The
//convention to use on the edit form is to add "?_method='PUT/DELETE/ETC'
// after the action URL. What we put in the method below is the syntax 
//express will use to look up the override :) 
app.use(methodOverride("_method"));



//Mongoose config
//setup Mongoose by creating schema and model

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//Restful ROUTES
//Index Route

//create a temporary blog post so we have something to see
// Blog.create({
// 	title: "My First Blog",
// 	image: "https://images.unsplash.com/photo-1507124484497-b7f446e65519",
// 	body: "Man I love living here. It's so peaceful and serene!"

// }, function(err, blog){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("You created a blog!");
// 		console.log(blog);
// 	}
// });

app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
	//find all blogs and show them
	Blog.find({}, function(err, allBlogs){
		if(err){
			console.log(err);
		}else{
			res.render("index", {blogs: allBlogs});
		}
	});
	
});

//CREATE restful routes

app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){
	//create the new post
	var data = req.body.blog;
	Blog.create(data, function(err, blog){
		if(err){
			console.log(err);
		}else{
			//redirect back to blogs index
			res.redirect("/blogs");
		}
	});
	
	
});

//SHOW Route
app.get("/blogs/:id", function(req, res){
	var id = req.params.id;
	Blog.findById(id,function(err, blog){
		if(err){
			console.log(err);
		} else {
			res.render("show", {blog: blog});
		}
	});
	

});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
	
	var id = req.params.id;
	Blog.findById(id,function(err, blog){
		if(err){
			console.log(err);
		} else {
			res.render("edit", {blog: blog});
		}
	});
});

//Update Route
app.put("/blogs/:id", function(req, res){
	
	var id = req.params.id;
	Blog.findByIdAndUpdate(id,req.body.blog,function(err, blog){
		if(err){
			console.log(err);
		} else {
			res.redirect("/blogs/" + id);
		}
	});
});

//Delete Route
app.delete("/blogs/:id", function(req, res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		//redirect somewhere
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
	
	
});

//chart showing restful routes 
app.get("/chart", function(req, res){
	res.sendFile(__dirname + "/views/chart.html");
});



//listener
app.listen(3000, function(){
	console.log("Blog App Has Started");
});