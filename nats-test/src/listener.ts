import { TicketCreatedListener } from './events/ticketCreatedListener';
import { randomBytes } from 'crypto';
import  nats  from 'node-nats-streaming';

console.clear();

const clientId= randomBytes(5).toString('hex')
const sc=nats.connect('ticketing',clientId,{
    url:'http://localhost:4222'
})

sc.on('connect',()=>{
   
    console.log("connected listener")
    sc.on('close',()=>{
        console.log(`${clientId} listener is closed`);
    })

    new TicketCreatedListener(sc).listen()
})


process.on('SIGTERM',()=>sc.close())
process.on('SIGINT', () => sc.close());