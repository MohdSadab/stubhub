import { TicketModel } from './../../models/ticketModel';
import { signIn } from '../../test/test-signin';
import request  from "supertest";
import { app } from "../../app";
import  mongoose  from 'mongoose';



it('it return 404 if ticket not found',async ()=>{

    // const id= new Mongoose.Types.ObjectId().toString()
    // await request(app).get(`/api/tickets/${id}`).expect(404);
    
})


it('it return 401 if diffrent user tried to access the order',async ()=>{

    const ticket = TicketModel.createTicket({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:"Event",
        price:200
    })
    await ticket.save();

    const {body:order}=await request(app).post("/api/orders/").set('Cookie',signIn()).send({
        ticketId:ticket.id
    })

    await request(app).get(`/api/orders/${order.id}`).set('Cookie',signIn()).expect(401);
    

})

it('it return 200 to access the order',async ()=>{

    const ticket = TicketModel.createTicket({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:"Event",
        price:200
    })
    await ticket.save();

    const user=signIn();
    const {body:order}=await request(app).post("/api/orders/").set('Cookie',user).send({
        ticketId:ticket.id
    })

    await request(app).get(`/api/orders/${order.id}`).set('Cookie',user).expect(200);
    

})