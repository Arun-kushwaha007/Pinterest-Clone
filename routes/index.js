var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const upload = require('./multer');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.render('login',{error: req.flash('error')}); /// the error portion will provide us an array of error .
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/upload', isLoggedIn ,upload.single("file") ,async function(req, res, next) {
  if(!req.file){
    return res.status(400).send("NO file were uploaded");
  }
  // res.send('file uploaded successfully!')
  // jo file upload hui hai use save karro as a post and uska post id user ko do and post ko userid do.
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image: req.file.filename,
    imageText : req.body.filecaption,
    user: user._id
  });
  user.posts.push(post._id);
  await user.save(); 
  res.redirect("/profile");
  res.redirect("/profile");
});

router.post('/fileupload', isLoggedIn, upload.single("image"), async function(req,res, next){
  const user = await userModel.findOne({username: req.session.passport.user})
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
})

// profile router 
router.get('/profile',isLoggedIn, async function(req, res, next) {
    const user = await userModel.findOne({
      username: req.session.passport.user
    })
    .populate("posts");
    // console.log(user)
  res.render("profile",{user});
});

// router of register
router.post("/register",  function(req, res){
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });
  
  userModel.register(userData, req.body.password).then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile"); 
    })
  })
})

// router of login
router.post("/login",passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  
}), function(req,res){
  
})

// router for logout
router.get("/logout", function(req, res){
  req.logout(function(err){
    if(err){return next(err); }
    res.redirect('/');
  })
})

function isLoggedIn(req,res, next){
  if(req.isAuthenticated())return next();
  res.redirect('/login');
}

module.exports = router;
