import { BadRequestError, NotFoundError, UnAuthorizedError } from '@sadabkhan/common';
import { Request, Response } from "express";
import { OrderModel } from '../models/orderModel';


export const getOrderController=async (req:Request,res:Response)=>{

    const {orderId}= req.params;
    const order= await OrderModel.findById(orderId).populate('ticket');
    if(!order){
        throw new NotFoundError();
    }
    if(req.currentUser!.id !== order.userId ){
        throw new UnAuthorizedError()
    }
    
    res.status(200).json(order);
}