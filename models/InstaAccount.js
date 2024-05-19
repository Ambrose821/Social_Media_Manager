const mongoose = require('mongoose');

const InstaAccountSchema = new mongoose.Schema({
        account_name: {
            type:String,
            required:true
            
            
        },
        instagram_id:{
            type: String,
            unique:true

        },
        content_posted:[String]
        
})

module.exports = mongoose.model('InstaAccount',InstaAccountSchema);