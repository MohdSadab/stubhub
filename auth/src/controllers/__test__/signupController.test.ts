import request  from "supertest";
import { app } from "../../app";

it('it return 201 if user successfully sign up',async ()=>{

    return request(app).post("/api/users/signup").send({
        "email":"test@test.com",
        "password":"passowrd"
    }).expect(201)
})

it('it return 400 if user invalid email sign up',async ()=>{

    return request(app).post("/api/users/signup").send({
        "email":"test",
        "password":"passowrd"
    }).expect(400)
})


it('check if user can able to get cookie after signup',async ()=>{

    const res=await request(app).post("/api/users/signup").send({
        "email":"test@test.com",
        "password":"passowrd"
    }).expect(201);

    expect(res.get('Set-Cookie')).toBeDefined()
})

it('duplicate email check if user can able to signup with same email 2',async ()=>{

    await request(app).post("/api/users/signup").send({
        "email":"test@test.com",
        "password":"passowrd"
    }).expect(201);

    await request(app).post("/api/users/signup").send({
        "email":"test@test.com",
        "password":"passowrd"
    }).expect(400);

})