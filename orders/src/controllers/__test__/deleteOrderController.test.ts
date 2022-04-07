
import { signIn } from '../../test/test-signin';
import request  from "supertest";
import { app } from "../../app";
import  mongoose  from 'mongoose';
import { TicketModel } from '../../models/ticketModel';
import { OrderStatus } from '@sadabkhan/common';


// let cookie:string;
// const createTicket=async ()=>{

//     const title="Title is";
//     const price= 100
//     cookie=signIn();
//     const {body}=await request(app).post("/api/tickets/").set('Cookie',cookie).send({
//         title,price
//     })

//     expect(body.title).toEqual(title);
//     expect(body.price).toEqual(price);

//     return body
// }


it('it return 401 if un authenticated user tries to create ticket',async ()=>{

    // const id= new Mongoose.Types.ObjectId().toString()
    // await request(app).put(`/api/tickets/${id}`).send({
    //     "title":"Ticket",
    //     "price": 100
    // }).expect(401)
    
})

// it('it return 400 if ticlet title is invalid ',async ()=>{

//     const id= new Mongoose.Types.ObjectId().toString()
//     await request(app).put(`/api/tickets/${id}`).set('Cookie',signIn()).send({
//         "title":"",
//         "price": 100
//     }).expect(400)

// })


// it('it return 400 if ticlet price is invalid',async ()=>{

//     const {id}= await createTicket()
//     await request(app).put(`/api/tickets/${id}`).set('Cookie',signIn()).send({
//         "title":"",
//         "price": 100
//     }).expect(400)
   
// })

// it('it return 401 if another user try to update a ticket ',async ()=>{

//     const title="Title is";
//     const price= 100
//     const {id}= await createTicket();
//     const res=await request(app).put(`/api/tickets/${id}`).set('Cookie',signIn()).send({
//         title,price
//     })

//     const{body}=res;
//     expect(res.statusCode).toEqual(401);

// })

it('it return cancelled if user delete the order',async ()=>{

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

    const {body:updatedOrder}= await request(app).delete(`/api/orders/${order.id}`).set('Cookie',user)

    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)

})