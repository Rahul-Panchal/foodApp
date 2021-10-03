const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const RestaurantProductsSchema =  Schema({
    'restaurant_detail_id'  : { type : Schema.Types.ObjectId, ref:'restaurant_details' },
    // 'food_category_id'      : { type : Schema.Types.ObjectId, ref:'food_categories' },
    // 'food_sub_category_id'  : { type : Schema.Types.ObjectId, ref:'food_sub_categories' },  	
    'food_product_id'       : { type : Schema.Types.ObjectId, ref:'food_products' },      
    'status'                : { type: Boolean, default : true },
    'half_plate_price'      : { type: Number, default : null },
    'full_plate_price'      : { type: Number, default : null },
    'product_price'         : { type: Number, default : null },
    'product_image'         : String,
    'product_discount'      : { type: Number, default : null },
    'update_date'           : { type: Date, default: Date.now()},
    'updated_by'            : { type : Schema.Types.ObjectId, ref:'user_details', default : null },
    'created_date'          : { type: Date, default: Date.now()},
    'created_by'            : { type : Schema.Types.ObjectId, ref:'user_details' },
});

module.exports = mongoose.model("restaurant_products", RestaurantProductsSchema);