var express = require('express');
var router = express.Router();

const exec = require('child_process').exec

var foodCategories = require('../models/food_categories');
var foodSubCategories = require('../models/food_sub_categories');

var PaymentMethods = require('../models/payment_methods');

const VerifyToken =  require('./VerifyToken');


/* GET users listing. */
// router.get('/', function(req, res, next) {

//   //exec('export HOME=/tmp && /usr/bin/soffice --show /home/rahul/Desktop/0.Press.pptx.pptx', (err, stdout, stderr) => console.log(stdout))

//   res.send('respond with a resource');
// });


router.get('/create-user',function(req,res,next){
  // console.log(req.body);
  res.send('Create user from admin');
});


/**
 * add food categories
 */
router.post("/add-food-category", VerifyToken, async (loggedInUser, request, response, next) => {
  try {

    if(loggedInUser.user_type==1){

      console.log('request.body');
      console.log(request.body);

      request.body['created_by'] = loggedInUser._id;
    // request.body.password = bcrypt.hashSync(request.body.password, 10);
      var foodCategory  = new foodCategories(request.body);
      var result = await foodCategory.save();
      response.send(result);
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * update food category details
 */
 router.put("/update-food-category/:category_id", VerifyToken, async(loggedInUser,request, response, next)=> {
  try {
      
    if(loggedInUser.user_type==1){
      var categoryId = request.params.category_id;

      const filter = { _id: categoryId };
      const update = request.body;

      // `result` is the document _after_ `update` was applied because of
      // `new: true`
      let result = await foodCategories.findOneAndUpdate(filter, update, {
        new: true
      });
      
      response.send(result);
    } else{
      response.status(500).send({"error":"user is not admin"});
    }

  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * delete food categories
 */
 router.delete("/delete-food-category/:category_id", VerifyToken, async (loggedInUser, request, response, next) => {
  try {

    var categoryId = request.params.category_id;

    if(loggedInUser.user_type==1){
      var result = await foodCategories.findOneAndRemove({ _id: categoryId });

      if(result.status){
        foodCategories.find({}).populate("created_by").exec(function(err, results) {
          if (err) throw err;
          console.log(results);
          response.send(results);
          // db.close();
        });
      } else {
        response.status(500).send({"error":"This Category doesn't exist."});
      }      
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});


/**
 * get only one food category
 */
 router.get('/get-food-categories/:category_id',VerifyToken, async (loggedInUser, request,response,next) => {
  // console.log(req.body);
  try {

    var categoryId = request.params.category_id;

    if(loggedInUser.user_type==1){

      foodCategories.findById({_id : categoryId}).populate("created_by").exec(function(err, result) {
        if (err) throw err;
        console.log(result);
        response.send(result);
      });
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * get all food categories listing
 */
router.get('/get-food-categories',VerifyToken, async (loggedInUser, req,res,next) => {
  // console.log(req.body);
  await foodCategories.find({}).populate("created_by").exec(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
    // db.close();
  });

  // res.send(foodCategories);
});





/**
 * add food sub categories
 */
router.post("/add-food-sub-category", VerifyToken, async (loggedInUser, request, response, next) => {
  try {

    if(loggedInUser.user_type==1){
      request.body['created_by'] = loggedInUser._id;
    // request.body.password = bcrypt.hashSync(request.body.password, 10);
      var foodSubCategory  = new foodSubCategories(request.body);
      var result = await foodSubCategory.save();
      response.send(result);
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * get all food sub categories listing
 */
router.get('/get-food-sub-categories',VerifyToken, async (loggedInUser, req,res,next) => {
  // console.log(req.body);
  await foodSubCategories.find({}).populate("created_by").populate("food_category_id").exec(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
    // db.close();
  });

  // res.send(foodCategories);
});


/**
 * get only one food sub category
 */
 router.get('/get-food-sub-categories/:sub_category_id',VerifyToken, async (loggedInUser, request,response,next) => {
  // console.log(req.body);
  try {

    var subCategoryId = request.params.sub_category_id;

    if(loggedInUser.user_type==1){

      foodSubCategories.findById({_id : subCategoryId}).exec(function(err, result) {
        if (err) throw err;
        console.log(result);
        response.send(result);
      });
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});


/**
 * get food sub categories by food categoryId
 */
router.get('/get-food-sub-categories-by-category-id/:food_category_id',VerifyToken, async (loggedInUser, request,response,next) => {
  // console.log(req.body);
  try {

    var foodCategoryId = request.params.food_category_id;

    if(loggedInUser.user_type==1){

      foodSubCategories.find({ food_category_id : foodCategoryId}).exec(function(err, result) {
        if (err) throw err;
        console.log(result);
        response.send(result);
      });
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * update food sub category details
 */
 router.put("/update-food-sub-category/:sub_category_id", VerifyToken, async(loggedInUser,request, response, next)=> {
  try {
      
    if(loggedInUser.user_type==1){
      var subCategoryId = request.params.sub_category_id;

      const filter = { _id: subCategoryId };
      const update = request.body;

      // `result` is the document _after_ `update` was applied because of
      // `new: true`
      let result = await foodSubCategories.findOneAndUpdate(filter, update, {
        new: true
      });
      
      response.send(result);
    } else{
      response.status(500).send({"error":"user is not admin"});
    }

  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * delete food categories
 */
 router.delete("/delete-food-sub-category/:sub_category_id", VerifyToken, async (loggedInUser, request, response, next) => {
  try {

    var subCategoryId = request.params.sub_category_id;

    if(loggedInUser.user_type==1){
      var result = await foodSubCategories.findOneAndRemove({ _id: subCategoryId });

      if(result.status){
        foodSubCategories.find({}).populate("food_category_id").populate("created_by").exec(function(err, results) {
          if (err) throw err;
          console.log(results);
          response.send(results);
          // db.close();
        });
      } else {
        response.status(500).send({"error":"This Sub Category doesn't exist."});
      }      
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});




/**
 * add payment methods
 */
router.post("/add-payment-methods", VerifyToken, async(loggedInUser,request, response, next)=> {
  try {
      
    if(loggedInUser.user_type==1){
      console.log(request.body);
      var paymentMethod = new PaymentMethods(request.body);
      var result = await paymentMethod.save();
      response.send(result);
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * get all kind of payment methods listing
 */
router.get('/get-payment-methods', VerifyToken, async(loggedInUser,request, res, next)=> {

  console.log(loggedInUser);
  // res.send(loggedInUser)
  await PaymentMethods.find({}, function (err, paymentMethods) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!paymentMethods) return res.status(404).send("No user found.");
    
    res.status(200).send(paymentMethods);
  });
  
});

var Publishable_Key = 'pk_test_51IToOxCOTBGYcNbf3NQ41xKNFURqH55dzZ7xina6qXDxVTGweK4N0M4vlkIcdBdM5yCyh8fdASg4yYixmtDL1btp00jDUfZWXT';
var Secret_Key = 'sk_test_51IToOxCOTBGYcNbfE3Zcz7xiMSbDXcDO7EDpaTuhwSm3h9VGCZ8w4LnsifsF1Ew53V3UmAGylGODvVk3nkwKuwz100BEQJ5r4w';
const stripe = require('stripe')(Secret_Key) 

router.get('/', function(req, res){ 
    res.render('Home', { 
       key: Publishable_Key 
    }) 
}) 
  
router.post('/payment', function(req, res){ 

  // https://stripe.com/docs/testing#cards
  
    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: 'Gourav Hammad', 
        address: { 
            line1: 'TC 9/4 Old MES colony', 
            postal_code: '452331', 
            city: 'Indore', 
            state: 'Madhya Pradesh', 
            country: 'India', 
        } 
    }) 
    .then((customer) => { 
  
        return stripe.charges.create({ 
            amount: 2500,     // Charing Rs 25 
            description: 'Web Development Product', 
            currency: 'INR', 
            customer: customer.id 
        }); 
    }) 
    .then((charge) => { 
        res.send("Success")  // If no error occurs 
    }) 
    .catch((err) => { 
        res.send(err)       // If some error occurs 
    }); 
}) 

router.get('/balance', function(req, res){ 

  const Stripe = require('stripe');
  const stripe = Stripe('sk_test_51IToOxCOTBGYcNbfE3Zcz7xiMSbDXcDO7EDpaTuhwSm3h9VGCZ8w4LnsifsF1Ew53V3UmAGylGODvVk3nkwKuwz100BEQJ5r4w');
  stripe.balance.retrieve(function(err, balance) {
    // asynchronously called
    if(err)
    res.send(err);

    res.send(balance);

  });

});


module.exports = router;
