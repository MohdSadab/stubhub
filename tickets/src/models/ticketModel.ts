import { Schema, model, connect, Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// 1. Create an interface representing a document in MongoDB.
interface Ticket {
    title: string;
    price: number;
    userId: string;
}


interface TicketDoc extends Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId: string;
}

interface TicketModel extends Model<TicketDoc> {
    createTicket(attrs:Ticket):TicketDoc
}

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    orderId:{
        type:String
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.createTicket = function name(params:Ticket) {
    return new TicketModel(params)
}

export const TicketModel = model<TicketDoc,TicketModel>('Tickets', ticketSchema);

