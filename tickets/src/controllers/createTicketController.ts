import { natsWrapper } from './../natsWrapper';
import { TicketCreatedPublisher } from '../events/publishers/ticketCreatedPublisher';

import { BadRequestError } from '@sadabkhan/common';
import { Request, Response } from "express";
import { TicketModel } from "../models/ticketModel";

export const createTicketController=async (req:Request,res:Response)=>{
    const {title,price}= req.body;

    try{
        const ticket= TicketModel.createTicket({title,price,userId:req.currentUser.id});
        await ticket.save();
        const publisher=new TicketCreatedPublisher(natsWrapper.client);
        publisher.publish({
            id:ticket.id,
            title:ticket.title,
            price:ticket.price,
            userId:ticket.userId,
            version:ticket.version
        })
        return res.status(201).json(ticket);
    }
    catch(error:any){
        throw new BadRequestError(error.message);
    }
}