import { errorHandlerMiddleware,currentUserMiddleware } from '@sadabkhan/common';
import express from 'express';
import 'express-async-errors';
import { ticketRouter } from './routes/ticketRoute';
import { NotFoundError } from '@sadabkhan/common';

import cookieSession from 'cookie-session';


const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieSession({
    signed:false,
    secure:false
}))

app.use(currentUserMiddleware);
app.use("/api/tickets",ticketRouter);

app.all('*',(req,res)=>{
    throw new NotFoundError();
})

app.use(errorHandlerMiddleware);

export {app}