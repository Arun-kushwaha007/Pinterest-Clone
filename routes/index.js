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
  res.render('index', { nav: false });
});

router.get('/login', function(req, res, next) {
  res.render('login', { error: req.flash('error'), nav: false });
});

router.get('/feed',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const posts = await postModel.find()
  .populate("user")
  res.render("feed", {user, posts, nav: true});
});

router.post('/upload', isLoggedIn, upload.single("file"), async function(req, res, next) {
  if (!req.file) {
    return res.status(400).send("No file was uploaded");
  }

  console.log('Uploaded file:', req.file);

  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post('/fileupload', isLoggedIn, upload.single("image"), async function(req, res, next) {
  if (!req.file) {
    return res.status(400).send("No file was uploaded");
  }

  console.log('Uploaded file:', req.file);

  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user =
  await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts");

  res.render("profile", { user, nav: true });
});

router.get('/show/posts', isLoggedIn, async function(req, res, next) {
  const user =
  await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts");

  res.render("show", { user, nav: true });
});

router.get('/add', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("add", { user, nav: true });
});

router.get('/createpost', isLoggedIn, function(req, res, next) {
  res.render("createpost");
});

router.post('/createpost', isLoggedIn, upload.single("postimage"), async function(req, res, next) {
  if (!req.file) {
    return res.status(400).send("No file was uploaded");
  }

  console.log('Uploaded file:', req.file);

  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    user: user._id,
    image: req.file.filename,
    title: req.body.title,
    description: req.body.description,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post("/register", function(req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password).then(function() {
    passport.authenticate("local")(req, res, function() {
      res.redirect("/profile");
    });
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}), function(req, res) {});

router.get("/logout", function(req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

module.exports = router;
