import { Schema, model, connect, Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// 1. Create an interface representing a document in MongoDB.
interface Payment {
    orderId: string;
    stripeId: string;
}


interface PaymentDoc extends Document {
    orderId: string;
    stripeId: string;
}

interface PaymentModel extends Model<PaymentDoc> {
    createPayment(attrs:Payment):PaymentDoc
}

const PaymentSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        }
    }
});

PaymentSchema.set('versionKey','version');
PaymentSchema.plugin(updateIfCurrentPlugin);

PaymentSchema.statics.createPayment = function name(params:Payment) {
    return new PaymentModel(params)
}

export const PaymentModel = model<PaymentDoc,PaymentModel>('Payments', PaymentSchema);

