const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = Schema({
    name        : String,
    username    : { type: String, required: true, index: { unique: true } },
    email       : String,
    phone       : Number,
    password    : { type: String, required: true },
    confirm_password:String,
    dob         : String,
    state       : Number,
    city        : Number,
    address     : String,
    profileImg  : [{ type: Schema.Types.ObjectId, ref:'ProfileImages' }],
});

module.exports = mongoose.model("users", UsersSchema);