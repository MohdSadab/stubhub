import { Publisher,Subjects,PaymentCreatedEvent } from "@sadabkhan/common";



export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PAYMENT_CREATED=Subjects.PAYMENT_CREATED;
}
