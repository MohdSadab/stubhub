
import { Listener, Subjects, OrderCreatedEvent } from "@sadabkhan/common";
import { Message } from "node-nats-streaming";
import { OrderModel as Order } from "../../models/orderModel";
import { queueName } from "./queueType";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{

    subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED

    queueGroupName = queueName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
       // Find the ticket that the order is reserving
    const {id,status,userId,version,ticket:{price}}=data 
    const order = Order.createOrder({
      id,
      version,
      status,
      userId,
      price
    })
    await order.save();
    // ack the message
    msg.ack();
    }

}