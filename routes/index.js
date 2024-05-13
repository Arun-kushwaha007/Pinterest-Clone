var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/alluserposts', async function(req,res, next){
  let user = await userModel.findOne({_id: "664198b9506c7030a3f90ddb"}).populate('posts');
  res.send(user);
});

router.get('/createuser',async function(req,res, next){
  let createduser = await userModel.create({
    username:"arun",
    password:"arun",
    posts: [],
    email: "arunsk1310@gmail.com",
    fullName: "Arun Singh Kushwaha",
  })
  res.send(createduser);
})



// creating post
router.get('/createpost', async function(req, res, next){
  let createdpost = await postModel.create({
    postText: "Kushw ho sab",
    user: "664198b9506c7030a3f90ddb"
  });
  let user = await userModel.findOne({_id: "664198b9506c7030a3f90ddb"});
  user.posts.push(createdpost._id);
  await user.save();

  res.send("done");
})

module.exports = router;
