import Mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { Payment } from '../services/paymentService';


export const signIn =()=>{

    const email="test@test.com";
    const id= new Mongoose.Types.ObjectId().toString();
    
    const jwt = Payment.getJwtToken({email,id})
    const buffer= Buffer.from(JSON.stringify({jwt})).toString('base64')
    return `session=${buffer}`

}