const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileImagesSchema = Schema({
    user_id: String,
    // imageName : {
    //     type    : String,
    //     default : "none",
    //     required: false,
    // },
    // imageData : {
    //     type    : String,
    //     required: false
    // }
    // image: { 
    //     data        : Buffer, 
    //     contentType : String 
    // }
    profileImg: {
        type: String
    }
});

module.exports = mongoose.model("ProfileImages", ProfileImagesSchema);
