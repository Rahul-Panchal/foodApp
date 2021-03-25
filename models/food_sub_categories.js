const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSubCategoriesSchema = Schema({
    'food_category_id'  : { type : Schema.Types.ObjectId, ref:'food_categories' },
    'name'              : { type : String, required : true},
    'image'             : String,
    'status'            : String,
   // 'qunatity_type'     : String,// ( in pcs/in half & full)
    'created_by'        : { type : Schema.Types.ObjectId, ref:'user_details' },
    'created_date'      : { type : Date, default : Date.now()},
});

module.exports = mongoose.model("food_sub_categories",FoodSubCategoriesSchema);