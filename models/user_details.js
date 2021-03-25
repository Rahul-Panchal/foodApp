const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const UserDetailsSchema = Schema({
    'name'              : { type: String, required: true },
    'username'          : { type: String, required: true, index: { unique: true } },
    'password'          : { type: String, required: true },
    'email_id'          : { type: String, required: true },
    'contact_no'        : { type: String, required: true },
    'address'           : String,
    'city_id'           : String,
    'state_id'          : String,
    'conutry_id'        : String,
    'pin_code'          : String,
    'user_type'         : { type: String, required: true }, //(customer / Restaurant Managers / Admin / Field boy) 
    'social_media_login': String, //[ Array Object ]
    'created_by'        : String,
    'created_date'      : {type: Date, default: Date.now()},
});

module.exports = mongoose.model("user_details", UserDetailsSchema);