import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@sadabkhan/common';
import { OrderModel } from './orderModel';
import { Schema, model, connect, Document, Model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface Ticket {
    id: string;
    title: string;
    price: number;
}


export interface TicketDoc extends Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
    version: number;
}

interface TicketModel extends Model<TicketDoc> {
    createTicket(attrs: Ticket): TicketDoc
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<TicketDoc | null>;
}

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return TicketModel.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

ticketSchema.methods.isReserved = async function () {

    const existingOrder = await OrderModel.findOne({
        ticket: this,
        status: {
            $nin: [
                OrderStatus.Cancelled
            ]
        }
    })
    return !!existingOrder;
}

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.createTicket = function name(params: Ticket) {
    return new TicketModel({...params,_id:params.id})
}



export const TicketModel = model<TicketDoc, TicketModel>('Tickets', ticketSchema);

