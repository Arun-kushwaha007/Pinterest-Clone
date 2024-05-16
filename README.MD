Steps to make :
     / route par login an d singup hoga
     /profile par aapko aapki profile dikhegi and aapke saved posts dikhege, aur ek uploaded section hogha jo abhi nahi bana rahe .
     /feed yaga par saari imgaes dikhegi
     /click karke imgae open hojaayegi save kr skte ho
     /board/:boardname poora board dikhega


notes while learning data association : 
    index.js content : -
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





/// further :-

posts
image
caption

multer
image upload
caption
