
import { connect } from 'mongoose';
import { app } from './app';

const PORT= process.env.port || 4000;
const initDb=async ()=>{
    console.log("started>>>>")
    if(!process.env.JWT_SECRET_KEY){
        throw new Error('Jwt secret key is not defined');
    }

    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI is not defined');
    }
    try {

        await connect(process.env.MONGO_URI)
        console.log("connected")
    } catch (error) {
        console.log(error,">>>>");
    }
    app.listen(PORT,async ()=>console.log("auth service running on port ",PORT));
}


initDb();

