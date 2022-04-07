import { NotFoundError, OrderStatus, UnAuthorizedError } from '@sadabkhan/common';
import { Request, Response } from "express";
import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher';
import { OrderModel } from '../models/orderModel';
import { natsWrapper } from '../natsWrapper';

export const deleteOrderController=async (req:Request,res:Response)=>{
    
    const {orderId}= req.params;
    const order= await OrderModel.findById(orderId);
    if(!order){
        throw new NotFoundError();
    }
    if(req.currentUser!.id !== order.userId ){
        throw new UnAuthorizedError()
    }

    order.status= OrderStatus.Cancelled;
    await order.save();

    // @todo publish order cancelled event
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
    });
    res.status(200).json(order);

}