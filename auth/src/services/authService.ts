import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface TokenArgs{
    id:string,
    email:string
}
export class Auth{

    private static saltRounds=10;
    static async hashPassword(password:string):Promise<string> {
        const hashPassword= await bcrypt.hash(password, Auth.saltRounds)
        return hashPassword
    }

    static async matchPassword(plainPassword:string,hashPassword:string):Promise<boolean> {
        const isMatch= await bcrypt.compare(plainPassword, hashPassword)
        return isMatch
    }

    static getJwtToken(args:TokenArgs):string{
        const token = jwt.sign(args,process.env.JWT_SECRET_KEY!)
        return token
    }
}

