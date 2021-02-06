const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');



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
//몽구스 내부 기능 어떤 기능을 실행하기 전에 해야하는 것
userSchema.pre('save',function( next ){

    //userSchema 가져오기
    var user = this;

    //비밀번호를 암호화 시킨다
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err,salt){
            if(err) return next(err);
            
            bcrypt.hash(user.password, salt,function(err, hash){
                if(err) return next(err);
                user.password = hash
                next()
            })    
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 1234567 암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    //ES5?
    var user = this;

    //토큰 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secrettoken')
     // user._id + 'token' = token
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })

}
//statics?
userSchema.statics.findByToken = function(token, cb){
    var user = this;
    //토큰 디코드
    jwt.verify(token, 'secrettoken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 후
        // 클라이언트에서 가져온 토큰과 데이터베이스에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id":decoded, "token": token }, function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })
    })
}

const User = mongoose.model('User',userSchema)

module.exports = {User}