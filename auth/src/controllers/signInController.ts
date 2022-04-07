import { BadRequestError } from '@sadabkhan/common';
import { Request, Response } from "express";
import { UserModel } from "../models/authModel";
import { Auth } from '../services/authService';


export const signInController=async (req:Request,res:Response)=>{

    const {email,password}= req.body;

    const user= await UserModel.findOne({email});
    if(!user){
        throw new BadRequestError('wrong credentials');
    }

    const match= await Auth.matchPassword(password,user.password)
    if(!match){
        throw new BadRequestError('wrong credentials');
    }
    req.session={
        jwt: Auth.getJwtToken({id:user.id,email:user.email})
    }
    res.status(200).json({id:user.id,email:user.email});
}