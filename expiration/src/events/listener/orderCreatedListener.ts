import { Listener, OrderCreatedEvent, Subjects } from "@sadabkhan/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/taskQueue";
import { queueName } from './queueType'

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{

    subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;

    queueGroupName = queueName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // add the data to message queue
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        try{

            await expirationQueue.add({
            orderId: data.id,
        }, {
            delay
        })
    }catch(err){
        console.log(err)
    }

    console.log("ackkkksksksk")
    // acknowledge the message
    msg.ack()
    }
}