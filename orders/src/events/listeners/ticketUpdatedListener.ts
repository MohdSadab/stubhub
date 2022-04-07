
import { Listener, Subjects, TicketUpdatedEvent } from "@sadabkhan/common";
import { Message } from "node-nats-streaming";
import { TicketModel } from "../../models/ticketModel";
import { queueName } from "./queueType";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{

    subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED

    queueGroupName = queueName

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await TicketModel.findByEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }

}