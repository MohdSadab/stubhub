import jwt from 'jsonwebtoken';

interface TokenArgs{
    id:string,
    email:string
}
export class Payment{

    static getJwtToken(args:TokenArgs):string{
        const token = jwt.sign(args,process.env.JWT_SECRET_KEY!)
        return token
    }
}

