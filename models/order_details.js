const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetailsSchema = Schema({
    'user_id'               : { type : Schema.Types.ObjectId, ref:'user_details' },
    'restaurant_id'         : { type : Schema.Types.ObjectId, ref:'restaurant_details' },
    'order_number'          : { type : String, default: Date.now().toString()},
    'status'                : { type : String, default: 1}, //( order received=1 / preparing=2 / on the way=3 / delivered=4/ cancelled=5 )
    'payment'               : { type : Number, default: null},
    'gst_percentage'        : { type : Number, default: null},
    'total_payment'         : { type : Number, default: null},
    'created_date'          : { type : Date, default: Date.now()},
    'created_by'            : { type : Schema.Types.ObjectId, ref:'user_details' },
    'order_food_detail_ids' : [{ type: Schema.Types.ObjectId, ref: 'order_food_details' }]
});


// OrderDetailsSchema.virtual('children', {
//     ref: 'order_food_details',   // the model to use
//     localField: '_id',  // find children where 'localField' 
//     foreignField: 'order_id' // is equal to foreignField
//   });

module.exports = mongoose.model("order_details", OrderDetailsSchema);