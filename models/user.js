const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose  = require("passport-local-mongoose"); 

const userSchema = new Schema(
    {
        email:{
            type:String,
            required: true,
        }
    }
);

userSchema.plugin(passportLocalMongoose);
 // it inplement hashing salting and user object also,
module.exports = mongoose.model("User",userSchema);