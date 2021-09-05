var express= require('express');
var jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
//importing routes
const authRoute=require('./routes/auth');
const postRoute=require('./routes/posts');
const modelRoute=require('./routes/model');
//connecting to db
mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true},()=>console.log('connected to db'));

//Middleware
app.use(express.json());
//route middleware
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);
app.use('/api/model',modelRoute);

app.listen(3000,function(){
    console.log('App lsitening on port 3000');
  });