import { Request, Response } from "express";


export const getCurrentUserController=(req:Request,res:Response)=>{
    res.json({currentUser:req.currentUser});
}
