const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const OrderPaymentsSchema =  Schema({
    'Order_detail_id'       : Schema.Types.ObjectId,
    'total_bill_amount'     : Number,
    'discount_in_percentage': Number,
    'actual_received_amount': Number,
    'payment_method_id'     : Schema.Types.ObjectId,
    'created_date'          : {type: Date, default: Date.now()},
    'created_by'            : { type : Schema.Types.ObjectId, ref:'user_details' },
});

module.exports = mongoose.model("order_payments", OrderPaymentsSchema);