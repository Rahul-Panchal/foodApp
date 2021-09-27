var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');
const mongoose    = require('mongoose');

var bodyParser      = require('body-parser');
var cors = require('cors');

// const {mongoUrl} = require('./config/keys');
const Users =  require('./models/users');

// environment variables
// process.env.NODE_ENV = 'production';
process.env.NODE_ENV = 'development';
// process.env.NODE_ENV = 'staging';

// uncomment below line to test this code against staging environment
// process.env.NODE_ENV = 'staging';

// config variables
const config = require('./config/config.js');



mongoose.connect(global.gConfig.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true, useFindAndModify: false });
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Users.find({}, function(err, result) {
//     if (err) throw err;
//     console.log('result from users collection from app file');
//     console.log(result);
    
//     setTimeout(function(){
//         console.log( __filename );
//         console.log( __dirname );
//     },1000);
//     // db.close();
// });

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var restaurantDetailRouter  = require('./routes/restaurant_detail');
var foodProductRouter  = require('./routes/food_product');
var orderDetailRouter = require('./routes/order_details');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

app.use(cors());

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({
    extended: false
    // extended: true
}));

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
    
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
  
//   next(createError(404));
// });


app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/restaurant-detail', restaurantDetailRouter);
app.use('/food-product',foodProductRouter);
app.use('/order-detail',orderDetailRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(8082, function (server) {
//   console.log('server is running now');
// });

app.listen(global.gConfig.PORT);

module.exports = app;
