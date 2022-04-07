import { connect,connection } from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod:any
beforeAll(async ()=>{
    process.env.JWT_SECRET_KEY='shshshs';
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await connect(uri);
    

})

beforeEach(async ()=>{

   const collections= await connection.db.collections();

   for( let collection of collections){
        await collection.deleteMany({})
   }

})


afterAll(async ()=>{
    await mongod.stop();
    await connection.close();
 
 })