
import { Listener, Subjects, TicketCreatedEvent } from "@sadabkhan/common";
import { Message } from "node-nats-streaming";
import { TicketModel } from "../../models/ticketModel";
import { queueName } from "./queueType";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{

    subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED

    queueGroupName = queueName

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;

        const ticket = TicketModel.createTicket({
            id,
            title,
            price,
        });
        await ticket.save();

        msg.ack();
    }

}