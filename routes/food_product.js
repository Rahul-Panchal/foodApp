var express = require('express');
var router = express.Router();

// var Users = require('../models/users');
var foodProducts = require('../models/food_products');

const verifyToken =  require('./VerifyToken');

var multer  = require('multer');

var productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/product_images');
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

var uploadProductImage = multer({storage: productImageStorage}).single('product_image');;

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
      uploadProductImage(request,response, async function(err) {
        if (err) {
          response.send('error uploading file' + err);
        }
  
        console.log('request.body');
        console.log(request.body);
        console.log('request.file');
        console.log(request);
        delete request.body["_id"]; 
        
        request.body.product_image = request.file.filename;
  
        request.body.is_active = true;
        console.log(request.body);

        request.body['created_by'] = loggedInUser._id;
      // request.body.password = bcrypt.hashSync(request.body.password, 10);
        var foodProduct  = new foodProducts(request.body);
        var result = await foodProduct.save();
        // response.send(result);

        response.json({
          result : result,
          success : true,
          body    : request.body,
          // insert_status : status,
          message : 'File uploaded!',
          file    : request.file,
          fileUrl : 'http://localhost:8081/images/product_images/' + request.file.filename
        });


      });


    } else{
      response.status(500).send({"error":"user is not admin"});
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * update restaurant details
 */
 router.put('/update-food-product/:food_product_id', verifyToken, async (loggedInUser, request, response, next) => {
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
        
        request.body.product_image = request.file.filename;

        request.body['updated_by'] = loggedInUser._id;

        var foodProductId = request.params.food_product_id;
      
        const filter = { _id: foodProductId };
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
          fileUrl : 'http://localhost:8081/images/' + request.file.filename
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

/**
 * get all food products
 */
 router.get('/product-list/:food_product_id', verifyToken, async (loggedInUser, request, response, next) => {
  try {
    var foodProductId = request.params.food_product_id;
      // await foodProducts.findOne({'_id':foodProductId}).populate('food_category_id').populate('food_sub_category_id').populate('created_by').exec(function(err, result){
      await foodProducts.findOne({'_id':foodProductId}).exec(function(err, result){
        if(err)
        response.send(err);
      
        response.send(result);
      });

  } catch (error) {
    response.status(500).send(error);
  }
});



/**
 * delete restaurant
 */
 router.delete("/delete-food-product/:food_product_id", verifyToken, async (loggedInUser, request, response, next) => {
  try {

    var foodProductId = request.params.food_product_id;

    if(loggedInUser.user_type==1){
      var result = await foodProducts.findOneAndRemove({ _id: foodProductId });

      if(result.status){
        foodProducts.find({}).populate('food_category_id').populate('food_sub_category_id').populate("created_by").exec(function(err, results) {
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




module.exports = router ;