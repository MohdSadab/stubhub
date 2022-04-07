import { Listener, Subjects, OrderCancelledEvent, NotFoundError, OrderStatus } from "@sadabkhan/common";
import { Message } from "node-nats-streaming";
import { OrderModel as Order } from "../../models/orderModel";
import { queueName } from "./queueType";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{

    subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;

    queueGroupName = queueName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
       
        const order =await Order.findOne({id:data.id, version: data.version-1});
        if(!order){
            msg.ack();
            throw new NotFoundError()
        }
        if(order.status===OrderStatus.Completed){
            return msg.ack()
        }

        order.status= OrderStatus.Cancelled;
        await order.save();
        msg.ack();
    }

}