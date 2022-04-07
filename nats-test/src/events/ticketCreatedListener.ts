import { TicketCreatedEvent } from './ticketCreatedEvent';
import { Listener } from "./baseListener";
import { Subjects } from './subjects';
import { Message } from 'node-nats-streaming';


export class TicketCreatedListener extends Listener<TicketCreatedEvent>{

    queueGroupName= 'payment-service';
    subject: Subjects.TICKET_CREATED=Subjects.TICKET_CREATED;

    onMessage(data: TicketCreatedEvent['data'], msg: Message){

        console.log('Event data!', data);
        console.log(data.id);
        console.log(data.title);
        console.log(data.price);
        msg.ack();
        
    }

}