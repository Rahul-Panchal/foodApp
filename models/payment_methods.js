const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentMethodsSchema =  Schema({
    'payment_method_name'   : { type : String, require : true },
    'status'                : { type : Boolean, default: false },
    'created_date'          : { type : Date, default: Date.now() },
    'created_by'            : { type : Schema.Types.ObjectId, ref:'user_details' },
});

module.exports = mongoose.model("payment_methods", PaymentMethodsSchema);

