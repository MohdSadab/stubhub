import { OrderCreatedPublisher } from './../events/publishers/orderCreatedPublisher';
import { natsWrapper } from '../natsWrapper';
import { BadRequestError, NotFoundError, OrderStatus } from '@sadabkhan/common';
import { Request, Response } from "express";
import { TicketModel } from "../models/ticketModel";
import { OrderModel } from '../models/orderModel';

const ORDER_EXPIRE_TIME=1*60;

export const createOrderController=async (req:Request,res:Response)=>{
    const {ticketId}= req.body;

    // find the ticket
    const ticket = await TicketModel.findById(ticketId);
    if(!ticket){
        throw new NotFoundError();
    }

    const isReserved= await ticket.isReserved();
    if(isReserved){
        throw new BadRequestError('Ticket is already reserved');
    }

    // create expires at
    const expiredAt= new Date();
    expiredAt.setSeconds(expiredAt.getSeconds()+ORDER_EXPIRE_TIME);

    const order = OrderModel.createOrder({
        ticket,
        userId:req.currentUser!.id,
        expiredAt,
        status:OrderStatus.Created
    })


    await order.save();

    const {id,version,status,userId}=order;
    // @todo publish order create event
    const publisher=new OrderCreatedPublisher(natsWrapper.client);
    publisher.publish({
        id,
        version,
        status,
        userId,
        expiresAt:order.expiredAt.toISOString(),
        ticket:{
            id:ticket.id,
            price: ticket.price
        }
    })
    
    return res.status(201).json(order);


}