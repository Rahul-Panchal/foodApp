const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderFoodDetailsSchema = Schema({
    'order_id'              : { type : Schema.Types.ObjectId, ref:'order_details' },
    'restaurant_product_id' : { type : Schema.Types.ObjectId, ref:'restaurant_products' },
    // 'food_category_id'      : { type : Schema.Types.ObjectId, ref:'food_categories' },
    // 'food_sub_category_id'  : { type : Schema.Types.ObjectId, ref:'food_sub_categories' }, 
    // 'food_product_id'       : { type : Schema.Types.ObjectId, ref:'food_products' },
    'quantity'              : String,
    'price'                 : String, 
    'total_amount'          : String,
    'created_date'          : { type : Date, default: Date.now()},
    'created_by'            : { type : Schema.Types.ObjectId, ref:'user_details' },
});

module.exports = mongoose.model("order_food_details", OrderFoodDetailsSchema);