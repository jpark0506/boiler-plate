const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')

//몽구스 서버 연결, password 부분 바꾸기
//몽구스 서버 내에서 Security-> Network Access 부분에서 모두 사용할 수 있게 바꿔준다
mongoose.connect('mongodb+srv://peterpark:guni0506@boiler-plate.39whi.mongodb.net/<dbname>?retryWrites=true&w=majority', 
{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false})
.then(()=>console.log('MongoDB connected')).catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})