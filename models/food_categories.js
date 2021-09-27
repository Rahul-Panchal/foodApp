const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodCategoriesSchema = Schema({
    name         : { type : String, require : true},
    status       : Boolean,
    created_by   : { type : Schema.Types.ObjectId, ref:'user_details' },
    created_date : { type : Date, default : Date.now()},
    // profileImg  : [{ type: Schema.Types.ObjectId, ref:'ProfileImages' }],
});

module.exports = mongoose.model("food_categories", FoodCategoriesSchema);