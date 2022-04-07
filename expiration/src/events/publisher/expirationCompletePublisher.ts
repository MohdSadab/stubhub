import { Publisher,ExpirationCreatedEvent, Subjects } from "@sadabkhan/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCreatedEvent>{
    subject: Subjects.EXPIRATION_COMPLETE=Subjects.EXPIRATION_COMPLETE;
}