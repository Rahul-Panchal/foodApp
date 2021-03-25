var express = require('express');
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


// var Users = require('../models/users');
var Users = require('../models/user_details');

const { secret } = require('../config/keys');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

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

router.post("/register", async (request, response) => {
  try {


console.log(request.body);
    request.body.password = bcrypt.hashSync(request.body.password, 10);
    var user = new Users(request.body);
    var result = await user.save();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
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

var VerifyToken = require('./VerifyToken');

router.get('/me', VerifyToken, function(req, res, next) {

  Users.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    
    res.status(200).send(user);
  });
  
});

/**
 * get all kind of users by admin 
 */
router.get('/get-users-list', VerifyToken, async(loggedInUser,req, res, next)=> {

  console.log(loggedInUser);
  // res.send(loggedInUser)
  await Users.find({}, { password: 0 }, function (err, users) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!users) return res.status(404).send("No user found.");
    
    res.status(200).send(users);
  });
  
});

module.exports = router;
