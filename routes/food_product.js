var express = require('express');
var router = express.Router();

// var Users = require('../models/users');
var foodProducts = require('../models/food_products');

const verifyToken =  require('./VerifyToken');


/* GET users listing. */
router.get('/', function(req, res, next) {

  //exec('export HOME=/tmp && /usr/bin/soffice --show /home/rahul/Desktop/0.Press.pptx.pptx', (err, stdout, stderr) => console.log(stdout))

  res.send('respond with a foodProducts');
});


/**
 * save food product details
 */
router.post('/add', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    if(loggedInUser.user_type==1){
      request.body['created_by'] = loggedInUser._id;
    // request.body.password = bcrypt.hashSync(request.body.password, 10);
      var foodProduct  = new foodProducts(request.body);
      var result = await foodProduct.save();
      response.send(result);
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * get all food products
 */
router.get('/product-list', verifyToken, async (loggedInUser, request, response, next) => {
  try {

      await foodProducts.find({}).populate('food_category_id').populate('food_sub_category_id').populate('created_by').exec(function(err, result){
        if(err)
        response.send(err);
      
        response.send(result);
      });

  } catch (error) {
    response.status(500).send(error);
  }
});



module.exports = router ;