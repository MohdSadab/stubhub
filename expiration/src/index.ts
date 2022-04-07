import { OrderCreatedListener } from './events/listener/orderCreatedListener';
import { natsWrapper } from './natsWrapper';


const PORT= process.env.port || 4000;
const initDb=async ()=>{

    if(!process.env.NATS_URI){
        throw new Error('NATS_URI is not defined');
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID is not defined');
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID is not defined');
    }
    if(!process.env.REDIS_URL){
        throw new Error('REDIS_URL is not defined');
    }
    console.log("process.env.REDIS_URL",process.env.REDIS_URL)
    try {

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URI)
        natsWrapper.client.on('close',()=>{
            console.log("closing connection");
        })

        new OrderCreatedListener(natsWrapper.client).listen()
        process.on('SIGTERM',()=>natsWrapper.client.close())
        process.on('SIGINt',()=>natsWrapper.client.close())
        
    } catch (error) {
        console.log(error,">>>>");
    }
}


initDb();

