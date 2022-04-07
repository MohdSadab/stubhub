import { OrderStatus } from '@sadabkhan/common';
import { Schema, model, connect, Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// 1. Create an interface representing a document in MongoDB.
interface Order {
    id: string;
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
}


interface OrderDoc extends Document {
    id: string;
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
}

interface OrderModel extends Model<OrderDoc> {
    createOrder(attrs: Order): OrderDoc
}

const OrderSchema = new Schema({
    status: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.createOrder = function name(params: Order) {
    return new OrderModel({...params,_id:params.id})
}

export const OrderModel = model<OrderDoc, OrderModel>('Orders', OrderSchema);

