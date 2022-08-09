//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose =require("mongoose")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const posts=[];
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/blogDB");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const postsSchema = new mongoose.Schema({
  title:{
    type:String,
    required:["true","add title please!!"],
  },
  desc:{
    type:String,
    required:["true","add title please!!"],
  },
})
const Post = mongoose.model("Post",postsSchema);


app.get("/",function(req,res){ 
  Post.find({},function(err,foundPosts){
    if(err){
      console.log(err);
    }else{
      res.render("home",{homeContent:homeStartingContent,posts:foundPosts});
    }
  })

})


app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
})

app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
})

app.get("/compose",function(req,res){
 

  res.render("compose");
 })
// :post is like a parameter which value you will pass in the chrome route it will chome in :post and
// we can get hold on to it. it creates a dynamic route
app.get("/posts/:postName",function(req,res){

  Post.find({},function(err,foundPosts){
    foundPosts.forEach(function(post){
      if(_.lowerCase(req.params.postName)===_.lowerCase(post.title)){
        res.render("post",{post:post})
      }
    })
  })
 
})
app.post("/compose",function(req,res){
  const newPost= new Post({
    title: req.body.postTitle,
    desc:req.body.desc,
  })
  Post.findOne({title:newPost.title},function(err,foundPost){
    if(err){
      console.log(err);
    }else{
      if(!foundPost)
      {
        newPost.save();
      }
    }
  })
  // posts.push(post);
  res.redirect("/");

})













app.listen(3000, function() {
  console.log("Server started on port 3000");
});
