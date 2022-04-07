import { Publisher,Subjects,TicketCreatedEvent } from "@sadabkhan/common";



export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TICKET_CREATED=Subjects.TICKET_CREATED;
}
