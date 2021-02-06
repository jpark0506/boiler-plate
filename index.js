const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyparser = require('body-parser');
const { User } = require('./models/User');


const config = require('./config/key');

//node-mon 없이 코드 수정하면 서버 재접 해야함
//node-mon 설치시 dev 붙이면 로컬에서만 사용할 수 있게 함

//분석해서 가져올 수 있음
//application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({extended:true}));
//application/json
app.use(bodyparser.json());


//몽구스 서버 연결, password 부분 바꾸기
//몽구스 서버 내에서 Security-> Network Access 부분에서 모두 사용할 수 있게 바꿔준다
//비밀 정보 보호하기
mongoose.connect(config.mongoURI, 
{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false})
.then(()=>console.log('MongoDB connected')).catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req,res)=>{
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})