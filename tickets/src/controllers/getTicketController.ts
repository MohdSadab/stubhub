import { BadRequestError, NotFoundError } from '@sadabkhan/common';
import { Request, Response } from "express";
import { TicketModel } from "../models/ticketModel";


export const getTicketController=async (req:Request,res:Response)=>{

    const {id}= req.params;
    const ticket= await TicketModel.findById(id);
    if(!ticket){
        throw new NotFoundError();
    }
    res.status(200).json(ticket);
}