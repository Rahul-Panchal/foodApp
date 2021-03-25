var express = require('express');
var router = express.Router();

// var Users = require('../models/users');
var restaurantDetails = require('../models/restaurant_details');

var restaurantProducts = require('../models/restaurant_products');

const verifyToken =  require('./VerifyToken');


/* GET users listing. */
router.get('/', function(req, res, next) {

  //exec('export HOME=/tmp && /usr/bin/soffice --show /home/rahul/Desktop/0.Press.pptx.pptx', (err, stdout, stderr) => console.log(stdout))

  res.send('respond with a RestaurantDetails');
});


/**
 * save restaurant details
 */
router.post('/add-restaurant', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    /**
     * 2 for user_type= restaurant manager
     */
    if(loggedInUser.user_type==2){
      request.body['created_by'] = loggedInUser._id;
    // request.body.password = bcrypt.hashSync(request.body.password, 10);
      var restaurant  = new restaurantDetails(request.body);
      var result = await restaurant.save();
      response.send(result);
    } else{
      response.status(500).send({message:"logged in user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * get all restaurant details
 */
router.get('/restaurant-list', verifyToken, async (loggedInUser, request, response, next) => {
  try {
    /**
     * 1 for user_type= admin
     */
    if(loggedInUser.user_type==1){
      await restaurantDetails.find({}).populate('owner_id').populate('created_by').exec(function(err, result){
        if(err)
        response.send(err);
      
        response.send(result);
      });
    } else{
      response.status(500).send({message:"logged in user is not admin"});
    }

  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * get all restaurant details on the behalf of it's manager
 */
router.get('/restaurant-list/:managerId', verifyToken, async (loggedInUser, request, response, next) => {
  try {
    var managerId = request.params.managerId;
    if(managerId) {
      await restaurantDetails.find({'owner_id':managerId}).populate('owner_id').populate('created_by').exec(function(err, result){
        if(err)
        response.send(err);
      
        response.send(result);
      });
    } else{
      response.status(500).send({message:"manager details have not provided"});
    }

  } catch (error) {
    response.status(500).send(error);
  }
});

//
/**
 * save restaurant product details
 */
router.post('/add-restaurant-product', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    /**
     * get all restaurant details on the behalf of it's manager
    */

    if(loggedInUser.user_type==2){
      request.body['created_by'] = loggedInUser._id;
    // request.body.password = bcrypt.hashSync(request.body.password, 10);
      var restaurantProduct  = new restaurantProducts(request.body);
      var result = await restaurantProduct.save();
      response.send(result);
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});


/**
 * get restaurant product details for a particular restaurant
 */
router.get('/restaurant-product-list/:restaurantId', verifyToken, async (loggedInUser, request, response, next) => {
  try {

      var restaurantId = request.params.restaurantId;
      if(restaurantId) {
        await restaurantProducts.find({'restaurant_detail_id':restaurantId}).populate('restaurant_detail_id').populate('food_category_id').populate('food_sub_category_id').populate('food_product_id').populate('created_by').exec(function(err, result){
          if(err)
          response.send(err);
        
          response.send(result);
        });
      } else {
        response.status(500).send({message:"restaurant details have not provided"});
      }

  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * get all restaurant product details
 */
router.get('/restaurant-product-list', verifyToken, async (loggedInUser, request, response, next) => {
  try {
      await restaurantProducts.find({}).populate('restaurant_detail_id').populate('food_category_id').populate('food_sub_category_id').populate('food_product_id').populate('created_by').exec(function(err, result){
          if(err)
          response.send(err);
        
          response.send(result);
      });

  } catch (error) {
    response.status(500).send(error);
  }
});


module.exports = router ;