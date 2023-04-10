const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash"); // javascript utility library, the functions, methods which came handy to developer, while development comes inside this package.
const mongoose = require('mongoose');

require('dotenv').config()

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const homeStartingContent = "This web application was developed by Shlok Agrawal as a project to showcase his web development skills. For the frontend, HTML, CSS, Bootstrap, and EJS were used, while Node.js, Express.js, MongoDB, and Mongoose were used for the backend.";

// Database Connectivity
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE);
  console.log("Database Connected Successfully!");
}

const postSchema = mongoose.Schema({
  postTitle: String,
  postContent: String
});

const Post = mongoose.model("Post", postSchema);

// let posts = [];

app.get("/", function (req,res) {
  // display posts from db
  async function displayPosts(){
    const posts = await Post.find({});
    res.render("home", { startingContent: homeStartingContent, postArray: posts });
  }
  displayPosts();
})

app.get("/contact", function (req, res) {
  res.render("contact");
})

app.get("/compose", function (req, res) {
  res.render("compose");
})

app.post("/compose", function (req,res) {

  // adding post to db
  const post = new Post({
    postTitle: req.body.postTitle,
    postContent: req.body.postBody
  });

  post.save();
  
  res.redirect("/");
})


app.get("/posts/:postID", function (req,res) {
  const id = req.params.postID;
  async function findByID(id) {
    const post = await Post.findById(id).exec();
    if(post===null){
      res.send("ID NOT FOUND!");
    }
    res.render("post", { postTitle: post.postTitle, postContent: post.postContent });
  }
  findByID(id);
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
