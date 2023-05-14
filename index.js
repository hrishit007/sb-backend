import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import actionRoutes from './routes/actions.js';

const app=express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());

app.get('/test',function(req,res){
    res.send('{"response":"Working"}');
    console.log('Works here');
});
app.use('/user',userRoutes);
app.use('/action',actionRoutes);

const PORT =process.env.PORT ;

mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> app.listen(  PORT,() => console.log(`Server running on port ${PORT}`)))
    .catch((error)=>console.log(error.message));