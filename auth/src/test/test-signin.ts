import request from 'supertest';
import { app } from '../app';


export const signIn =async ()=>{

    const email="test@test.com";
    const password= "password";
    const data = await request(app).post('/api/users/signup').send({email,password}).expect(201);
    return data.get('Set-Cookie');

}