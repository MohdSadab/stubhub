import { OrderCreatedListener } from './events/listeners/orderCreatedListener';
import { natsWrapper } from './natsWrapper';

import { connect } from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/orderCancelledListener';

const PORT= process.env.port || 4000;
const initDb=async ()=>{

    if(!process.env.JWT_SECRET_KEY){
        throw new Error('Jwt secret key is not defined');
    }
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI is not defined');
    }
    if(!process.env.NATS_URI){
        throw new Error('NATS_URI is not defined');
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID is not defined');
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID is not defined');
    }
    try {

        await connect(process.env.MONGO_URI)
        console.log("connected")
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URI)
        natsWrapper.client.on('close',()=>{
            console.log("closing connection");
        })
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        process.on('SIGTERM',()=>natsWrapper.client.close())
        process.on('SIGINt',()=>natsWrapper.client.close())
        
    } catch (error) {
        console.log(error,">>>>");
    }
    app.listen(PORT,async ()=>console.log("titcket service running on port ",PORT));
}


initDb();

