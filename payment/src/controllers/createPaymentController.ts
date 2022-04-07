import { natsWrapper } from '../natsWrapper';
import { BadRequestError, NotFoundError, OrderStatus, UnAuthorizedError } from '@sadabkhan/common';
import { Request, Response } from "express";
import { OrderModel as Order } from "../models/orderModel";
import { stripe } from '../stripe';
import { PaymentModel } from '../models/paymentModel';
import { PaymentCreatedPublisher } from '../events/publishers/paymentCreatedPublisher';

export const createPaymentController=async (req:Request,res:Response)=>{
    // find order
    const {token,orderId} = req.body;
    const order = await Order.findById(orderId); 

    // check order exist or not and authorized
    if(!order){
        throw new NotFoundError()
    }

    if(order.userId !== req.currentUser.id){
        throw new UnAuthorizedError()
    }

    //  check order status if cancelled or paid return 400
    if( order.status === OrderStatus.Cancelled){
        throw new BadRequestError('Order is cancelled')
    }
   
    // if token valid save the payment 
    const charge = await stripe.paymentIntents.create({
        amount: order.price,
        currency: 'inr',
        payment_method_types: ['card'],
        statement_descriptor: 'Custom descriptor',
    });

    const payment = PaymentModel.createPayment({
        orderId,
        stripeId:charge.id
    })

    await payment.save()
    
    //  emit payment created event
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        orderId,
        stripeId:charge.id
    })

    return res.status(201).json({id:payment.id})

}