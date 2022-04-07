import { TicketCreatedPublisher } from './events/ticketCreatedPublisher';
import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';

const clientId= randomBytes(5).toString('hex')
const sc=nats.connect('ticketing',clientId,{
    url:'http://localhost:4222'
})

sc.on('connect',async ()=>{
    console.log("connected")

    // const data=JSON.stringify({id:clientId,title:"hello"});

    // sc.publish('ticket:created',data,(err)=>{
    //     if(!err){
    //         console.log("published")
    //     }
    // })

    const publisher=new TicketCreatedPublisher(sc);

    try {
        await publisher.publish({
            id:'1',
            title:'hellow moto',
            price:100,
            userId:'1324'
        })
    } catch (error) {
        console.log(error);
    }

})