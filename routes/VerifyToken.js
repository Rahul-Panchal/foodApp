var jwt = require('jsonwebtoken');
const { secret } = require('../config/keys');

var Users = require('../models/user_details');

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
    
  jwt.verify(token, secret, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
    // if everything good, save to request for use in other routes
    // req.userId = decoded.id;

    Users.findById(decoded.id, 
      { password: 0 }, // projection
      function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
          
        // res.status(200).send(user); //Comment this out!
        next(user); // add this line
      });
    });


    // next();
  // });
}

// add the middleware function
// router.use(function (user, req, res, next) {
//   res.status(200).send(user);
// });

module.exports = verifyToken;