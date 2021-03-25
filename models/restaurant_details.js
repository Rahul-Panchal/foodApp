const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const RestaurantDetailsSchema = Schema({
    'restaurant_name'           : String,
    'owner_id'                  : {type : Schema.Types.ObjectId, ref :'user_details'},
    'restaurant_opening_time'   : String,
    'restaurant_closing_time'   : String,
    'restaurant_current_status' : Boolean,
    'banner_image'              : String,
    'contact_no'                : String,
    'email_id'                  : String,
    'address'                   : String,
    'city_id'                   : {type : Schema.Types.ObjectId, default : null},
    'state_id'                  : {type : Schema.Types.ObjectId, default : null},
    'pincode'                   : String,
    // 'country_id'                : Schema.Types.ObjectId,
    'delivery_area_in_km'       : String,
    'minimum_order_value'       : String,
    'restaurant_desc'           : String,
    'food_image'                : String, // [ Food Image Upload and Menu ]
    'delivery_maximum_time'     : String, // [on show website Like 30 min]
    'gst_percentage'            : Number,
    'delivery_charge'           : String,
    'status'                    : {type : Boolean, default : true },
    'created_by'                : {type : Schema.Types.ObjectId, ref :'user_details'},
    'created_date'              : {type : Date, default : Date.now()},
});

module.exports = mongoose.model("restaurant_details",RestaurantDetailsSchema);
