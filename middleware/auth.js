const {User} = require("../models/User");
let auth = (req, res, next)=> {
    //인증처리를 하는 곳
     //클라이언트에서 쿠키 가져오기
     let token = req.cookies.x_auth;
     //토큰 복호화 후 유저를 작는다
     User.findByToken(token, (err,user)=>{
         if(err) throw err;
         if(!user) return res.json({isAuth: false, error:true})
         //req에 넣은 이유는 index에서도 쓸 수 있게 하기 위해서
         req.token = token;
         req.user = user;
         //할 거 했으면 갈 수 있게해준다 
         next();
     })
     //유저가 있으면 인증 
     //없으면 인증 X
}
module.exports = {auth};