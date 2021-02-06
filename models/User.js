const mongoose = require("mongoose");

//model 안에 schema 존재
//schema는 object, number, string등등의 형태를 띌 수 있음
//schema는 model의 세부적인 틀 느낌

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength:50
    },
    email:{
        type: String,
        trim : true,
        unique : 1
    },
    password:{
        type:String,
        minlength: 5
    },
    lastname : {
        type:String,
        maxlength:50
    },
    role: {
        type: Number,
        default : 0
    },
    image: String,
    token:{
        type: String
    },
    tokenExp:{
        type: Number
    }
})

const User = mongoose.model('User',userSchema)

module.exports = {User}