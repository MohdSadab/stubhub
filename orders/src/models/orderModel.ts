import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@sadabkhan/common';
import { Schema, model, connect, Document, Model } from 'mongoose';
import { TicketDoc } from './ticketModel';
import mongoose from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface Order {
    userId: string;
    expiredAt: Date;
    status:OrderStatus;
    ticket: TicketDoc;
}


export interface OrderDoc extends Document {
    userId: string;
    expiredAt: Date;
    status:OrderStatus;
    ticket: TicketDoc;
    version: number;
}

interface OrderModel extends Model<OrderDoc> {
    createOrder(attrs:Order):OrderDoc
}

const OrderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum:Object.values(OrderStatus)
    },
    expiredAt:{
        type: Date,
        default: new Date()
    },
    ticket:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Tickets'
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        }
    }
});

OrderSchema.set('versionKey','version');
OrderSchema.plugin(updateIfCurrentPlugin);


OrderSchema.statics.createOrder = function name(params:Order) {
    return new OrderModel(params)
}

export const OrderModel = model<OrderDoc,OrderModel>('Orders', OrderSchema);

