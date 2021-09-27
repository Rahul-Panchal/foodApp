var express = require('express');
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


// var Users = require('../models/users');
var Users = require('../models/user_details');

const { secret } = require('../config/keys');

var VerifyToken = require('./VerifyToken');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


var multer  = require('multer');
var profileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images/profile_images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

var uploadProfileImage = multer({storage: profileImageStorage}).single('profile_image');;

/*
const uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: {
    fileSize: 1000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) { 
       // upload only png and jpg format
       return cb(new Error('Please upload a Image'))
     }
   cb(undefined, true)  
  }
})
*/


// router.post('/upload', upload.single('file'), async(request,response,next)=>{
/*
router.post('/upload', async(request,response,next)=>{

  upload(request,response, async function(err) {
    if (err) {
      response.send('error uploading file');
    }
console.log(request);
    // const querybuilder = await conn.get_connection();
    // /**
    //  * insert query
    //  *
    // var status = await querybuilder.returning('id').insert('businesses', {business_name : request.body.name, business_logo : 'http://localhost:8081/images/' + request.file.filename, created : '2021-04-02 11:57:29', status : 1});
    
    response.json({
      success : true,
      body    : request.body,
      // insert_status : status,
      message : 'File uploaded!',
      file    : request.file,
      fileUrl : 'http://localhost:8081/images/' + request.file.filename
    });

  })
});*/

router.get('/about', function (req, res, next) {

  Users.find({}, function (err, result) {
    if (err) throw err;
    console.log('result from users collection on index file');
    console.log(result);

    setTimeout(function () {
      console.log(__filename);
      console.log(__dirname);
    }, 1000);
    // db.close();

    res.render('about', { usersList: result });
    // res.send("About Page", { usersList: result });
  });

  // res.render('about');
  // res.send("About Page", { usersList: usersList });
});


router.post('/create-user', function (req, res, next) {
  // console.log(req.body);
  var myData = new Users(req.body);
  // Users.save();

  myData.save().then(item => {
    res.send("item saved to database");
  }).catch(err => {
    res.status(400).send("unable to save to database");
  });

  // res.send('Create user from index');
});

/**
 *  add new user in application
 */
router.post("/--register", async (request, response) => {
  try {

    request.body.is_active = true;
    console.log(request.body);
    
    request.body.password = bcrypt.hashSync(request.body.password, 10);
    var user = new Users(request.body);
    var result = await user.save();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 *  add new user in application
 */
 router.post("/register", async (request, response) => {
  try {

    uploadProfileImage(request,response, async function(err) {
      if (err) {
        response.send('error uploading file' + err);
      }

      console.log('request.body');
      console.log(request.body);
      console.log('request.file');
      console.log(request.file);
      delete request.body["_id"]; 
      
      request.body.profile_image = request.file.filename;

      request.body.is_active = true;
      console.log(request.body);
      
      request.body.password = bcrypt.hashSync(request.body.password, 10);
      var user = new Users(request.body);
      var result = await user.save();
      
      // response.send(result);

      response.json({
        result : result,
        success : true,
        body    : request.body,
        // insert_status : status,
        message : 'File uploaded!',
        file    : request.file,
        fileUrl : 'http://localhost:8081/images/' + request.file.filename
      });


    });
  } catch (error) {
    response.status(500).send(error);
  }
});


/**
 * update user details
 */
 router.put("/update-user-details/:user_id", VerifyToken, async(loggedInUser,request, response, next)=> {
  try {
    var userId = request.params.user_id;

    uploadProfileImage(request,response, async function(err) {
      if (err) {
        response.send('error uploading file' + err);
      }

      console.log('request.body');
      console.log(request.body);
      console.log('request.file');
      console.log(request.file);

      delete request.body["password"];

      request.body.profile_image = (typeof(request.file==='undefined')) ? request.body.old_profile_image : request.file.filename;

      const filter = { _id: userId };
      const update = request.body;

      // `result` is the document _after_ `update` was applied because of
      // `new: true`
      let result = await Users.findOneAndUpdate(filter, update, {
        new: true
      });

      response.json({
        result : result,
        success : true,
        body    : request.body,
        // insert_status : status,
        message : 'File uploaded!',
        file    : (typeof(request.file==='undefined')) ? request.body.old_profile_image : request.file,
        fileUrl : (typeof(request.file==='undefined')) ? 'http://localhost:8081/images/profile_images/'+request.body.old_profile_image : 'http://localhost:8081/images/profile_images/' + request.file.filename
      });
    });

    // response.send("PLPLLP");
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * update user details
 */
/*
router.put("/----------update-user-details/:user_id", uploadProfileImage.single('profile_image'), VerifyToken, async(loggedInUser,request, response, next)=> {
  try {
    var userId = request.params.user_id;
    console.log('loggedInUser');
    console.log(loggedInUser);

    console.log(request.body);
    delete request.body["password"];
    // request.body.password = bcrypt.hashSync(request.body.password, 10);
    // var user = new Users(request.body);
    // var result = await user.save();

    const filter = { _id: userId };
    const update = request.body;

// `result` is the document _after_ `update` was applied because of
// `new: true`
    let result = await Users.findOneAndUpdate(filter, update, {
      new: true
    });

    response.send(result);

    // response.send("PLPLLP");
  } catch (error) {
    response.status(500).send(error);
  }
});


/**
 * delete user details
 */
router.put("/delete-user-details/:user_id", VerifyToken, async(loggedInUser,request, response, next)=> {
  try {
    var userId = request.params.user_id;
    console.log('loggedInUser');
    console.log(loggedInUser);

    console.log(request.body);
    let userDetail = {};
    await Users.findOne({'_id': userId}, { password: 0 }, function (err, users) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!users) return res.status(404).send("No user found.");
      
      userDetail = users;
    });

    console.log('userDetail');
    console.log(userDetail);

    const filter = { _id: userId };
    const update = {is_active : (userDetail.is_active) ? false : true};

// `result` is the document _after_ `update` was applied because of
// `new: true`
    let result = await Users.findOneAndUpdate(filter, update, {
      new: true
    });

    // response.send(result);
    (result) ?
    // await Users.find({is_active: true}, { password: 0 }, function (err, users) {
    await Users.find({}, { password: 0 }, function (err, users) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!users) return res.status(404).send("No user found.");
      
      response.status(200).send(users);
    }) : response.send(result);



    // response.send("PLPLLP");
  } catch (error) {
    response.status(500).send(error);
  }
});



/**
 * get all kind of users by admin with active status
 */
 router.get('/get-users-list', VerifyToken, async(loggedInUser,req, res, next)=> {

  // console.log(loggedInUser);
  // res.send(loggedInUser)
  // await Users.find({is_active: true}, { password: 0 }, function (err, users) {
  await Users.find({}, { password: 0 }, function (err, users) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!users) return res.status(404).send("No user found.");
    
    res.status(200).send(users);
  });
  
});

/**
 * get only one user from users list by admin 
 */
 router.get('/get-users-list/:user_id', VerifyToken, async(loggedInUser,req, res, next)=> {

  var userId = req.params.user_id;
  // console.log(loggedInUser);
  // res.send(loggedInUser)
  await Users.findOne({'_id': userId}, { password: 0 }, function (err, users) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!users) return res.status(404).send("No user found.");
    
    res.status(200).send(users);
  });
});



router.post('/add-user', function (req, res, next) {
  // console.log(req.body);
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  var myData = new Users(req.body);
  // Users.save();

  myData.save().then(user => {
    res.send(user);
  }).catch(error => {
    // res.status(400).send("unable to save to database");
    res.status(500).send(error);
  });

  // res.send('Create user from index');
});

router.post("/login", async (request, response) => {
  try {
  
    var user = await Users.findOne({ username: request.body.username }).exec();
    console.log(user)
    if (!user) {
      return response.status(400).send({ message: "The username does not exist" });
    }
    if (!bcrypt.compareSync(request.body.password, user.password)) {
      return response.status(400).send({ message: "The password is invalid" });
    }

    var token = jwt.sign({ id: user._id }, secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    response.send({ user: user, message: "The username and password combination is correct!", 'token': token });
    // response.send({ message: "The username and password combination is correct!"});
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * getting logged in user details from generated token
 */
// router.get('/me', function (req, res) {
//   var token = req.headers['x-access-token'];
//   if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//   jwt.verify(token, secret, function (err, decoded) {
//     if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

//     // res.status(200).send(decoded);


//     Users.findById(decoded.id, 
//       { password: 0 }, // projection
//       function (err, user) {
//         if (err) return res.status(500).send("There was a problem finding the user.");
//         if (!user) return res.status(404).send("No user found.");
          
//         res.status(200).send(user); //Comment this out!
//         // next(user); // add this line
//       });

//   });
// });

router.get('/me--', VerifyToken, function(req, res, next) {

  Users.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    
    res.status(200).send(user);
  });
  
});

router.get('/me', VerifyToken, function(loggedInUser,req, res, next) {

  res.status(200).send(loggedInUser);
  // Users.findById(req.userId, { password: 0 }, function (err, user) {
  //   if (err) return res.status(500).send("There was a problem finding the user.");
  //   if (!user) return res.status(404).send("No user found.");
    
  //   res.status(200).send(user);
  // });
  
});

module.exports = router;
