import { signIn } from './../../test/test-signin';
import request  from "supertest";
import { app } from "../../app";



it('it return 201 if user successfully sign up',async ()=>{

    const cookie = await signIn();

    const res=await request(app).get("/api/users/currentuser").set("Cookie",cookie).expect(200) 
    console.log(res.body)
    // expect(res.data.email).toBeDefined();
})