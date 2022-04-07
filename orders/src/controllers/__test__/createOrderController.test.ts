import { TicketModel } from '../../models/ticketModel';
import { signIn } from '../../test/test-signin';
import request  from "supertest";
import { app } from "../../app";
import mongoose from 'mongoose'
import { OrderModel } from '../../models/orderModel';
import { OrderStatus } from '@sadabkhan/common';

it('it return 404 if ticket not found',async ()=>{

    const ticketId= new mongoose.Types.ObjectId();
    await request(app).post("/api/orders/").set('Cookie',signIn()).send({
        ticketId
    }).expect(404)
    
})

it('it return 400 if ticket is reserved',async ()=>{

    const ticket = TicketModel.createTicket({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:"Event",
        price:200
    })
    await ticket.save();

    const order= OrderModel.createOrder({
        ticket,
        userId:'shshhs',
        expiredAt:new Date(),
        status: OrderStatus.Created
    })
    await order.save();
    await request(app).post("/api/orders/").set('Cookie',signIn()).send({
        ticketId:ticket.id
    }).expect(400)
    
})


it('create a order successfully',async ()=>{

    const ticket = TicketModel.createTicket({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:"Event",
        price:200
    })
    await ticket.save();

    const {body:order}=await request(app).post("/api/orders/").set('Cookie',signIn()).send({
        ticketId:ticket.id
    })
    expect(order.ticket.id).toEqual(ticket.id)

})