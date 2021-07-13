//jshint esversion:6
// Load the full build.

var _ = require('lodash');

// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');
const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");
const ejs = require("ejs");

const mongoose=require("mongoose");

mongoose.connect('mongodb+srv://admin-naina:Naina@123@cluster0.vkrwq.mongodb.net/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const homeStartingContent = "Welcome to Daily Journal! Write whatever is on your mind and you want to share it with others and find out what others have to share about their day!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum makrhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

/////////////////////////////////////////////////////////////////////////////////////////////////////////
const blogSchema=mongoose.Schema({
  title:String,
  post:String,
  name:String,
});
const Entry=mongoose.model("Entry",blogSchema);

let day=date.getDate();

app.get("/",function(req,res){
  Entry.find({},function(err,data){
    if(err){
      console.log(err);
    }else{
      res.render("home",{startC:homeStartingContent,listofblogs:data});
    }
  });

});


app.get("/compose",function(req,res){
  res.render("compose",{});
});

app.post("/compose",function(req,res){
  const newBlog=new Entry({
    title: req.body.title,
    post: req.body.post,
    name: req.body.name
  });
  newBlog.save();
  res.redirect("/");


});





app.get("/about",function(req,res){
  res.render("about",{aboutC:aboutContent});
});
app.get("/contact",function(req,res){
  res.render("contact",{contactC:contactContent});
});









app.get("/posts/:id",function(req,res){

  var requestedId=req.params.id;

  Entry.find({},function(err,data){
    if(err){
      console.log(err);
    }else{
      for(var i=0;i<data.length;i++){
        if(data[i]._id==requestedId){
          res.render("blog",{blogTitle:data[i].title,blogPost:data[i].post,blogName:data[i].name});
          break;
        }
      }
    }
  });

});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
