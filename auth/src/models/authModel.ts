import { Schema, model, connect, Document, Model } from 'mongoose';
import { Auth } from '../services/authService';

// 1. Create an interface representing a document in MongoDB.
interface User {
    email: string;
    password: string;
}


interface UserDoc extends Document {
    email: string;
    password: string;
}

interface UserModel extends Model<UserDoc> {
    createUser(attrs:User):UserDoc
}

const authSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
            delete ret.password
        },
        versionKey:false
    }
});

authSchema.pre('save',async function(done) {
    if(this.isModified('password')){
        const hashPassowrd= await Auth.hashPassword(this.get('password'));
        console.log(hashPassowrd);
        this.set('password',hashPassowrd)
    }
    done();
})

authSchema.statics.createUser = function name(params:User) {
    return new UserModel(params)
}

export const UserModel = model<UserDoc,UserModel>('User', authSchema);

