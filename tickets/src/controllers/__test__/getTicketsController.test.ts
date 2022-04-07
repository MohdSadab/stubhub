import { signIn } from '../../test/test-signin';
import request  from "supertest";
import { app } from "../../app";
import  Mongoose  from 'mongoose';



const createTicket=async ()=>{

    const title="Title is";
    const price= 100
    const {body}=await request(app).post("/api/tickets/").set('Cookie',signIn()).send({
        title,price
    })

    expect(body.title).toEqual(title);
    expect(body.price).toEqual(price);
}


it('it return 200 if ticket not found',async ()=>{

    await createTicket();
    await createTicket();
    await createTicket();
   
    const {body}=await request(app).get(`/api/tickets/`)

    expect(body.length).toEqual(3);
    
})