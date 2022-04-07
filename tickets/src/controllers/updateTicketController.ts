import { BadRequestError, NotFoundError, UnAuthorizedError } from '@sadabkhan/common';
import { Request, Response } from "express";
import { TicketUpdatedPublisher } from '../events/publishers/ticketUpdatedPublisher';
import { TicketModel } from "../models/ticketModel";
import { natsWrapper } from '../natsWrapper';

export const updateTicketController=async (req:Request,res:Response)=>{
    const {title,price}= req.body;
    const {id} = req.params;

    const ticket= await TicketModel.findById(id);

    if(!ticket){
        throw new NotFoundError();
    }

    if(ticket.userId !== req.currentUser.id){
        throw new UnAuthorizedError();   
    }

    if(ticket.orderId){
        throw new BadRequestError('Can not edit reserved ticket')
    }


    ticket.set({
        title,
        price
    })
    await ticket.save();
    const publisher=new TicketUpdatedPublisher(natsWrapper.client);
        publisher.publish({
            id:ticket.id,
            title:ticket.title,
            price:ticket.price,
            userId:ticket.userId,
            version:ticket.version
        })
    return res.status(200).json(ticket);

}