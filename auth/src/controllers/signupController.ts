import { BadRequestError } from '@sadabkhan/common';
import { Request, Response } from "express";
import { UserModel } from "../models/authModel";
import { Auth } from '../services/authService';

export const signUpController=async (req:Request,res:Response)=>{
    const {email,password}= req.body;

    const exists= await UserModel.findOne({email});

    if(exists){
        throw new BadRequestError('User Already Exists');
    }
    
    try{
        const user= UserModel.createUser({email,password});
        await user.save();
        console.log("creating a user",email);
        req.session={
            jwt: Auth.getJwtToken({id:user.id,email:user.email})
        }
        return res.status(201).json(user);
    }
    catch(error:any){
        console.log(error);
        throw new BadRequestError(error.message);
    }
}