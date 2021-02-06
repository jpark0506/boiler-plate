const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyparser = require('body-parser');
const { User } = require('./models/User');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
//auth는 객체로 가져옴, {auth}는 콜백함수를 가져옴
const {auth} = require('./middleware/auth');

//node-mon 없이 코드 수정하면 서버 재접 해야함
//node-mon 설치시 dev 붙이면 로컬에서만 사용할 수 있게 함

//분석해서 가져올 수 있음
//application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({extended:true}));
//application/json
app.use(bodyparser.json());
//여기 뒤에 () 안 붙여서 실행 안됨 ㅋㅋㅋㅋㅋㅋ
app.use(cookieParser());


//몽구스 서버 연결, password 부분 바꾸기
//몽구스 서버 내에서 Security-> Network Access 부분에서 모두 사용할 수 있게 바꿔준다
//비밀 정보 보호하기
mongoose.connect(config.mongoURI, 
{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false})
.then(()=>console.log('MongoDB connected')).catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})
//앞에 꼭 / 붙여주기
app.post('/api/users/register', (req,res)=>{
    //회원가입할 때 필요한 정보들을 클라이언트에서 가져오면 
    //그것들을 데이터베이스에 넣어준다

    const user = new User(req.body)

    user.save((err)=>{
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success:true     
        })
    })
})

app.post('/api/users/login', (req,res)=>{

    //요청된 이메일을 데이터 베이스에서 있는지 찾는다
    User.findOne({email : req.body.email}, (err, user)=>{
        if(!user){
            return res.json({
                loginSuccss:false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch)
                return res.json({loginSuccss:false, message:"비밀번호가 틀렸습니다."});

            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                res.cookie("x_auth",user.token)
                    .status(200)
                    .json({loginSuccss:true, userId : user._id})
            })
        })
    })
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    
    //비밀번호까지 맞다면 토큰을 생성하기
})

//auth는 미들웨어 리턴하기 전에 하는 것
app.get('/api/users/auth',auth,(req,res)=>{

    //여기까지 미들웨어를 통과해왔다는 이야기는 auth가 True라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin : req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname : req.user.lastname,
        image: req.user.image
    })

})

app.get('/api/users/logout', auth, (req,res)=>{
    User.findOneAndUpdate({_id: req.user._id},{
        token:""}
        ,(err, user)=>{
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success:true
            })
        })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})