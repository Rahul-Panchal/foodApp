const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const OrderFeedbacksSchema =  Schema({
    'Order_detail_id'   : Schema.Types.ObjectId,
    'ratings'           : Number,
    'feedback_comments' : Text,
    'posted_by'         : Schema.Types.ObjectId,
    'posted_date'       : {type: Date, default: Date.now()},
    'is_approved'       : Boolean,
    'approved_date'     : Date,
    'approved_by'       : { type : Schema.Types.ObjectId, ref:'user_details' },
});

module.exports = mongoose.model("order_feedbacks", OrderFeedbacksSchema);