var express = require('express');
var router = express.Router();

// var Users = require('../models/users');
var orderDetails = require('../models/order_details');
var orderFoodDetails = require('../models/order_food_details');

const verifyToken =  require('./VerifyToken');


/* GET users listing. */
router.get('/', function(req, res, next) {

  //exec('export HOME=/tmp && /usr/bin/soffice --show /home/rahul/Desktop/0.Press.pptx.pptx', (err, stdout, stderr) => console.log(stdout))

  res.send('respond with a orderDetails');
});


/**
 * save food order details
 */
router.post('/new-order', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    var foodDetails =  JSON.parse(request.body.food_details);
    
    if(loggedInUser.user_type==4){
      request.body['user_id'] = loggedInUser._id;
      request.body['created_by'] = loggedInUser._id;

      /**
       * save order details
       */
      var orderDetail  = new orderDetails(request.body);
      var result = await orderDetail.save();

      var saveFoodDetails = [];

      /**
       * save order's food details 
       */
      foodDetails.forEach(async (foodDetail,index)=>{
        foodDetail['order_id'] = result._id;
        foodDetail['created_by'] = loggedInUser._id;

        var orderFoodDetail = new orderFoodDetails(foodDetail);
        var saveFoodDetail = await orderFoodDetail.save();
        saveFoodDetails.push(saveFoodDetail);

        /**
         * @tutorial: steps
         * 1. Find the order details by order ID.
         * 2. Call Push method on order_food_detail_ids key of orderDetails.
         * 3. Pass newly created food detail as value.
         * 4. Call save method.
         * reference: https://dev.to/oluseyeo/how-to-create-relationships-with-mongoose-and-node-js-11c8
        */
        const savedOrderDetail = await orderDetails.findById({_id: saveFoodDetail.order_id})
        savedOrderDetail.order_food_detail_ids.push(saveFoodDetail);
        await savedOrderDetail.save();

        if (saveFoodDetails.length === foodDetails.length) {
          response.send({'order_details' : result, 'food_details' : saveFoodDetails});
        }
      });
      
    } else{
      response.status(500).send({"error":"user is not authorized"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * get all food orders
 */
router.get('/orders-list', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    await orderDetails.find({}).populate('user_id').populate({
      path: 'order_food_detail_ids',
      // Get all details from inner related collections
      populate: { 
        path: 'restaurant_product_id', 
        populate : { 
          path:'food_product_id'
        } 
      }
    }).populate('restaurant_id').exec(function(err, result){
        if(err)
        response.send(err);
        
        console.log(result);
        response.send(result);
      });

  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * get a particular food order by order id
 */
router.get('/orders-list/:order_id', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    var orderId = request.params.order_id;

    await orderDetails.findById({'_id': orderId}).populate('user_id').populate({
      path: 'order_food_detail_ids',
      // Get all details from inner related collections
      populate: { 
        path: 'restaurant_product_id', 
        populate : { 
          path:'food_product_id'
        } 
      }
    }).populate('restaurant_id').exec(function(err, result){
        if(err)
        response.send(err);
        
        console.log(result);
        response.send(result);
      });

  } catch (error) {
    response.status(500).send(error);
  }
});


/**
 * get all food order by logged in user
 */
router.get('/my-orders', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    var loggedInUserId = loggedInUser._id;

    await orderDetails.find({'user_id': loggedInUserId}).populate('user_id').populate({
      path: 'order_food_detail_ids',
      // Get all details from inner related collections
      populate: { 
        path: 'restaurant_product_id', 
        populate : { 
          path:'food_product_id'
        } 
      }
    }).populate('restaurant_id').exec(function(err, result){
        if(err)
        response.send(err);
        
        console.log(result);
        response.send(result);
      });

  } catch (error) {
    response.status(500).send(error);
  }
});


module.exports = router ;