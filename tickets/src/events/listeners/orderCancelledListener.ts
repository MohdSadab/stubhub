import { Listener, Subjects, OrderCancelledEvent } from "@sadabkhan/common";
import { Message } from "node-nats-streaming";
import { TicketModel as Ticket } from "../../models/ticketModel";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";
import { queueName } from "./queueType";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{

    subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;

    queueGroupName = queueName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({ orderId: undefined });
        await ticket.save();
        await new TicketUpdatedPublisher(this._client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version,
        });

        msg.ack();
    }

}