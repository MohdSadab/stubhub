import { signIn } from '../../test/test-signin';
import request  from "supertest";
import { app } from "../../app";
import  Mongoose  from 'mongoose';



it('it return 404 if ticket not found',async ()=>{

    const id= new Mongoose.Types.ObjectId().toString()
    await request(app).get(`/api/tickets/${id}`).expect(404);
    
})


it('it return 200 if ticket not found',async ()=>{

    const title="Title is";
    const price= 100
    const {body}=await request(app).post("/api/tickets/").set('Cookie',signIn()).send({
        title,price
    })

    expect(body.title).toEqual(title);
    expect(body.price).toEqual(price);
    await request(app).get(`/api/tickets/${body.id}`).expect(200);
    
})