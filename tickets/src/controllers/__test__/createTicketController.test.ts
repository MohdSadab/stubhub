import { signIn } from '../../test/test-signin';
import request  from "supertest";
import { app } from "../../app";
import { natsWrapper } from '../../natsWrapper';

it('it return 401 if un authenticated user tries to create ticket',async ()=>{

    await request(app).post("/api/tickets/").send({
        "title":"Ticket",
        "price": 100
    }).expect(401)
    
})

it('it return 400 if ticlet title is invalid ',async ()=>{

    await request(app).post("/api/tickets/").set('Cookie',signIn()).send({
        "title":"",
        "price": 100
    }).expect(400)

})


it('it return 400 if ticlet price is invalid',async ()=>{

    await request(app).post("/api/tickets/").set('Cookie',signIn()).send({
        "title":"valid",
        "price": -100
    }).expect(400)
   
})

it('create a ticket successfully',async ()=>{

    const title="Title is";
    const price= 100
    const {body}=await request(app).post("/api/tickets/").set('Cookie',signIn()).send({
        title,price
    })

    expect(body.title).toEqual(title);
    expect(body.price).toEqual(price);

})


it('it checks publish event for ticket created',async ()=>{

    const title="Title is";
    const price= 100
    const {body}=await request(app).post("/api/tickets/").set('Cookie',signIn()).send({
        title,price
    })

    expect(natsWrapper.client.publish).toHaveBeenCalled();

})