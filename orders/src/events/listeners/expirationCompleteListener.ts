
import { ExpirationCreatedEvent, Listener, NotFoundError, OrderStatus, Subjects } from "@sadabkhan/common";
import { Message } from "node-nats-streaming";
import { OrderModel } from "../../models/orderModel";
import { OrderCancelledPublisher } from "../publishers/orderCancelledPublisher";

import { queueName } from "./queueType";

export class ExpirationCompleteListener extends Listener<ExpirationCreatedEvent>{

    subject: Subjects.EXPIRATION_COMPLETE = Subjects.EXPIRATION_COMPLETE

    queueGroupName = queueName

    async onMessage(data: ExpirationCreatedEvent['data'], msg: Message) {
        
        const order =await OrderModel.findById(data.orderId).populate('ticket');

        if(!order){
            throw new NotFoundError();
        }
        // if order completed do not cancelled it
        if(order.status === OrderStatus.Completed){
            return msg.ack();
        }
        order.set({
            status: OrderStatus.Cancelled,
        });
        
        await order.save();
        console.log(order.ticket.id,">>>>>>>>>>>>>isn")
        await new OrderCancelledPublisher(this._client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
        },
        });

        msg.ack();
    }

}