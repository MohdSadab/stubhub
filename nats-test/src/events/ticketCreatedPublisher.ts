import { TicketCreatedEvent } from './ticketCreatedEvent';
import { Publisher } from "./basePublisher";
import { Subjects } from './subjects';



export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
}