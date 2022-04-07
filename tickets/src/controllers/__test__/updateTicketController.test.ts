
import { signIn } from '../../test/test-signin';
import request  from "supertest";
import { app } from "../../app";
import  mongoose  from 'mongoose';
import { natsWrapper } from '../../natsWrapper';
import { TicketModel } from '../../models/ticketModel';


let cookie:string;
const createTicket=async ()=>{

    const title="Title is";
    const price= 100
    cookie=signIn();
    const {body}=await request(app).post("/api/tickets/").set('Cookie',cookie).send({
        title,price
    })

    expect(body.title).toEqual(title);
    expect(body.price).toEqual(price);

    return body
}


it('it return 401 if un authenticated user tries to create ticket',async ()=>{

    const id= new mongoose.Types.ObjectId().toString()
    await request(app).put(`/api/tickets/${id}`).send({
        "title":"Ticket",
        "price": 100
    }).expect(401)
    
})

it('it return 400 if ticlet title is invalid ',async ()=>{

    const id= new mongoose.Types.ObjectId().toString()
    await request(app).put(`/api/tickets/${id}`).set('Cookie',signIn()).send({
        "title":"",
        "price": 100
    }).expect(400)

})


it('it return 400 if ticlet price is invalid',async ()=>{

    const {id}= await createTicket()
    await request(app).put(`/api/tickets/${id}`).set('Cookie',signIn()).send({
        "title":"",
        "price": 100
    }).expect(400)
   
})

it('it return 401 if another user try to update a ticket ',async ()=>{

    const title="Title is";
    const price= 100
    const {id}= await createTicket();
    const res=await request(app).put(`/api/tickets/${id}`).set('Cookie',signIn()).send({
        title,price
    })

    const{body}=res;
    expect(res.statusCode).toEqual(401);

})

it('it return 200 update a ticket successfully',async ()=>{

    const title="Title Update is";
    const price= 200
    const {id}= await createTicket();
    const res=await request(app).put(`/api/tickets/${id}`).set('Cookie',cookie).send({
        title,price
    })

    const{body}=res;
    expect(res.statusCode).toEqual(200);
    expect(body.title).toEqual(title);
    expect(body.price).toEqual(price);

})


it('it checks publish event for ticket updated',async ()=>{

    const title="Title Update is";
    const price= 200
    const {id}= await createTicket();
    const res=await request(app).put(`/api/tickets/${id}`).set('Cookie',cookie).send({
        title,price
    })

    expect(natsWrapper.client.publish).toHaveBeenCalled();

})

it('rejects updates if the ticket is reserved', async () => {
    const cookie = signIn();
  
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'asldkfj',
        price: 20,
      });
  
    const ticket = await TicketModel.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();
  
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'new title',
        price: 100,
      })
      .expect(400);
  });