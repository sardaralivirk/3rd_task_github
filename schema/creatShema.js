const mongoose = require('mongoose');
const userSchema= new mongoose.Schema({
    name:String,
    possward:{type:String,
        required:true,
        minlength:5

    },   
    email: String,
    otp:String
   
})

const Shme = new mongoose.model("sign_in", userSchema)

module.exports=Shme;