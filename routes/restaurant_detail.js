var express = require('express');
var router = express.Router();

// var Users = require('../models/users');
var restaurantDetails = require('../models/restaurant_details');

var restaurantProducts = require('../models/restaurant_products');
var foodProducts = require('../models/food_products');

const verifyToken =  require('./VerifyToken');
const fs = require('fs');


/* GET users listing. */
router.get('/', function(req, res, next) {

  //exec('export HOME=/tmp && /usr/bin/soffice --show /home/rahul/Desktop/0.Press.pptx.pptx', (err, stdout, stderr) => console.log(stdout))

  res.send('respond with a RestaurantDetails');
});


/**
 * save restaurant details
 */
router.post('/---add-restaurant', verifyToken, async (loggedInUser, request, response, next) => {
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


var multer  = require('multer');

var bannerImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/banner_images');
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

var uploadBannerImage = multer({storage: bannerImageStorage}).single('banner_image');;



/**
 * save restaurant details
 */
 router.post('/add-restaurant', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    /**
     * 2 for user_type= restaurant manager
     */
    // if(loggedInUser.user_type==2){

      uploadBannerImage(request,response, async function(err) {
        if (err) {
          response.send('error uploading file' + err);
        }
  
        console.log('request.body');
        console.log(request.body);
        console.log('request.file');
        console.log(request);
        delete request.body["_id"]; 
        
        request.body.banner_image = request.file.filename;
  
        request.body.is_active = true;
        console.log(request.body);


        request.body['created_by'] = loggedInUser._id;
      // request.body.password = bcrypt.hashSync(request.body.password, 10);
        var restaurant  = new restaurantDetails(request.body);
        var result = await restaurant.save();
        // response.send(result);

        response.json({
          result : result,
          success : true,
          body    : request.body,
          // insert_status : status,
          message : 'File uploaded!',
          file    : request.file,
          fileUrl : 'http://localhost:8081/images/banner_images/' + request.file.filename
        });


      });

    // } else{
    //   response.status(500).send({message:"logged in user is not admin"});
    // }
  } catch (error) {
    response.status(500).send(error);
  }
});


/**
 * update restaurant details
 */
 router.put('/update-restaurant/:restaurantId', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    /**
     * 2 for user_type= restaurant manager
     */
    if(loggedInUser.user_type == 1 || loggedInUser.user_type == 2){

      uploadBannerImage(request,response, async function(err) {
        if (err) {
          response.send('error uploading file' + err);
        }

        console.log('request.body for update restaurant');
        console.log(request.body);

        console.log('request.file');
        console.log(request.file);
        
        request.body.banner_image = request.file.filename;

        request.body['updated_by'] = loggedInUser._id;

        var restaurantId = request.params.restaurantId;
      
        const filter = { _id: restaurantId };
        const update = request.body;

        let result = await restaurantDetails.findOneAndUpdate(filter, update, {
          new: true
        });

        // response.send(result);

        response.json({
          result : result,
          success : true,
          body    : request.body,
          // insert_status : status,
          message : 'File uploaded!',
          file    : request.file,
          fileUrl : 'http://localhost:8081/images/banner_images/' + request.file.filename
        });
      });

    } else{
      response.status(500).send({message:"logged in user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});


/**
 * get anyone restaurant details
 */
router.get('/restaurant-list/:restaurantId', verifyToken, async (loggedInUser, request, response, next) => {
  try {
    var restaurantId = request.params.restaurantId;
    /**
     * 1 for user_type= admin
     */
    if(loggedInUser.user_type==2 || loggedInUser.user_type==1){
      await restaurantDetails.findOne({'_id':restaurantId}).populate('owner_id').populate('created_by').exec(function(err, result){
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
 * get all restaurant details
 */
 router.get('/restaurant-list', verifyToken, async (loggedInUser, request, response, next) => {
  try {
    /**
     * 1 for user_type= admin
     */
    if(loggedInUser.user_type==2 || loggedInUser.user_type==1){
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
 * delete restaurant
 */
 router.delete("/delete-restaurant/:restaurantId", verifyToken, async (loggedInUser, request, response, next) => {
  try {

    var restaurantId = request.params.restaurantId;

    if(loggedInUser.user_type==1){
      var result = await restaurantDetails.findOneAndRemove({ _id: restaurantId });

      if(result.status){
        restaurantDetails.find({}).populate("created_by").exec(function(err, results) {
          if (err) throw err;
          console.log(results);
          response.send(results);
          // db.close();
        });
      } else {
        response.status(500).send({"error":"This Restaurant doesn't exist."});
      }      
    } else{
      response.status(500).send({"error":"user is not admin"});
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

/*************************************Restaurant Food Product Lists***************************/

var restaurantProductImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/restaurant_product_images');
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

var uploadRestaurantProductImage = multer({storage: restaurantProductImageStorage}).single('product_image');;
var path = require('path');

/**
 * save restaurant product details
 */
router.post('/add-restaurant-product', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    console.log('request.body form add restuatrant food product');
    console.log(request.body);
    /**
     * get all restaurant details on the behalf of it's manager
    */

    if(loggedInUser.user_type==1 || loggedInUser.user_type==2){

      uploadRestaurantProductImage(request,response, async function(err) {
        if (err) {
          response.send('error uploading file' + err);
        }
  
        console.log('request.body');
        console.log(request.body);
        console.log('request.file');
        console.log(request.file);
        delete request.body["_id"]; 
        
        if(request.file) {
          request.body.product_image = request.file.filename;
        } else {

          delete request.body.product_image;
          try {
            var foodProductId = request.body.food_product_id;
              
            let foodProduct =  await foodProducts.findOne({'_id':foodProductId});
   
            console.log('foodProduct');
            console.log(foodProduct);
            // File destination.txt will be created or overwritten by default.
            fs.copyFile(path.join(__dirname, '../public')+'/images/product_images/'+foodProduct.product_image, path.join(__dirname, '../public')+'/images/restaurant_product_images/'+foodProduct.product_image, (err) => {
              if (err) {
                console.log('error in file transfer');
                console.log(err);
                throw err;

              }

              console.log(path.join(__dirname, '../public')+'/images/product_images/'+foodProduct.product_image +' is was copied to '+ path.join(__dirname, '../public')+'/images/restaurant_product_images/'+foodProduct.product_image);
            });

            request.body.product_image = foodProduct.product_image;
        
          } catch (error) {
            response.status(500).send(error);
          }
        }

        request.body.created_by = loggedInUser._id;

        var restaurantProduct  = new restaurantProducts(request.body);
        var result = await restaurantProduct.save();
        console.log('result');
        console.log(result);
        response.send(result);

        // response.json({
        //   result : result,
        //   success : true,
        //   body    : request.body,
        //   // insert_status : status,
        //   message : 'File uploaded!',
        //   file    : request.file,
        //   fileUrl : 'http://localhost:8081/images/restaurant_product_images/' + request.file.filename
        // });

      });
    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * update restaurant product details
 */
 router.put('/update-restaurant-product/:restaurant_product_id', verifyToken, async (loggedInUser, request, response, next) => {
  try {

    var restaurantProductId = request.params.restaurant_product_id;

    console.log('request.body update form for restuatrant food product');
    console.log(request.body);
    /**
     * get all restaurant details on the behalf of it's manager
    */

    if(loggedInUser.user_type==1 || loggedInUser.user_type==2){

      uploadRestaurantProductImage(request,response, async function(err) {
        if (err) {
          response.send('error uploading file' + err);
        }
  
        console.log('request.body');
        console.log(request.body);
        console.log('request.file');
        console.log(request.file);
        
        if(request.file) {
          request.body.product_image = request.file.filename;
        } else {
          delete request.body.product_image;
        }

        request.body.updated_by = loggedInUser._id;

        const filter = { _id: restaurantProductId };
        const update = request.body;

        let result = await restaurantProducts.findOneAndUpdate(filter, update, {
          new: true
        });

        response.send(result);

        // response.json({
        //   result : result,
        //   success : true,
        //   body    : request.body,
        //   // insert_status : status,
        //   message : 'File uploaded!',
        //   file    : request.file,
        //   fileUrl : 'http://localhost:8081/images/restaurant_product_images/' + request.file.filename
        // });

      });
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
        // await restaurantProducts.find({'restaurant_detail_id':restaurantId}).populate('restaurant_detail_id').populate('food_category_id').populate('food_sub_category_id').populate('food_product_id').populate('created_by').exec(function(err, result){
        await restaurantProducts.find({'restaurant_detail_id':restaurantId}).populate('restaurant_detail_id').populate({
            path: 'food_product_id',
            // Get all details from inner related collections
            populate: { 
              path: 'food_sub_category_id', 
              populate : { 
                path:'food_category_id'
              } 
            }
          }).populate('created_by').exec(function(err, result){
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
 * get restaurant product details for a particular restaurant_product_id
 */
router.get('/get-restaurant-product/:restaurant_product_id', verifyToken, async (loggedInUser, request, response, next) => {
  try {

      var restaurantProductId = request.params.restaurant_product_id;
      if(restaurantProductId) {
        // await restaurantProducts.findById(restaurantProductId).exec(function(err, result){
        /*
        await restaurantProducts.findById(restaurantProductId).populate('restaurant_detail_id').populate({
            path: 'food_product_id',
            // Get all details from inner related collections
            populate: { 
              path: 'food_sub_category_id', 
              populate : { 
                path:'food_category_id'
              } 
            }
          }).populate('created_by').exec(function(err, result){
*/
          await restaurantProducts.findById(restaurantProductId).populate({
            path: 'food_product_id',
            // Get all details from inner related collections
            populate: { 
              path: 'food_sub_category_id', 
              populate : { 
                path:'food_category_id'
              } 
            }
          }).exec(function(err, result){

          if(err)
          response.send(err);
        
          response.send(result);
        });
      } else {
        response.status(500).send({message:"product details have not provided"});
      }

  } catch (error) {
    response.status(500).send(error);
  }
});



/**
 * delete restaurant product details for a particular restaurant product
 */
router.delete('/delete-restaurant-product/:restaurant_product_Id', verifyToken, async (loggedInUser, request, response, next) => {
  try {

      var restaurantProductId = request.params.restaurant_product_Id;
      if(restaurantProductId) {
        // await restaurantProducts.find({'restaurant_detail_id':restaurantId}).populate('restaurant_detail_id').populate('food_category_id').populate('food_sub_category_id').populate('food_product_id').populate('created_by').exec(function(err, result){
        
          var result = await restaurantProducts.findOneAndRemove({ _id: restaurantProductId });
        
          console.log('result of delete');
          console.log(result);
          let restaurantId = result.restaurant_detail_id

          if(result.status){
            await restaurantProducts.find({'restaurant_detail_id':restaurantId}).populate('restaurant_detail_id').populate({
              path: 'food_product_id',
              // Get all details from inner related collections
              populate: { 
                path: 'food_sub_category_id', 
                populate : { 
                  path:'food_category_id'
                } 
              }
            }).populate('created_by').exec(function(err, result){
            if(err)
            response.send(err);
          
            response.send(result);
          });
        } else {
          response.status(500).send({"error":"This Restaurant Food Product doesn't exist."});
        }
      } else {
        response.status(500).send({message:"restaurant Food Product details have not provided"});
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