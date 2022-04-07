
import { Publisher,Subjects,OrderCancelledEvent } from "@sadabkhan/common";



export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.ORDER_CANCELLED=Subjects.ORDER_CANCELLED;
}
