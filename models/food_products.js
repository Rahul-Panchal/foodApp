const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodProductsSchema = Schema({
    'food_category_id'      : { type : Schema.Types.ObjectId, ref:'food_categories' },
    'food_sub_category_id'  : { type : Schema.Types.ObjectId, ref:'food_sub_categories' },  	
    'product_name'          : String,
    'product_taste_type'    : String,// [ Veg/Non Veg ]
    'product_description'   : String,
    'product_price'         : String,
    'product_disclaimer'    : String,
    'product_image'         : String,// [Array Object Multiple]
    'product_weight_desc'   : String,// [Half Plate / Full Plate ( Need help Input text or create separate table ) ]
    'status'                : Boolean,// [0/1]
    'product_best_offer'    : String,// [0/1]
    'product_top_selling'   : String,// [0/1]
    'updated_date'          : String,
    'updated_by'            : String,
    'created_by'            : { type : Schema.Types.ObjectId, ref:'user_details' },
    'created_date'          : { type : Date, default : Date.now()},
});

module.exports = mongoose.model("food_products",FoodProductsSchema);