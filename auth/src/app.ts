import { errorHandlerMiddleware } from '@sadabkhan/common';
import express from 'express';
import 'express-async-errors';
import { authRouter } from './routes/authRoute';
import { NotFoundError } from '@sadabkhan/common';

import cookieSession from 'cookie-session';


const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieSession({
    signed:false,
    secure:false
}))

app.use("/api/users",authRouter);

app.all('*',(req,res)=>{
    throw new NotFoundError();
})

app.use(errorHandlerMiddleware);

export {app}