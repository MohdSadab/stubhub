import { randomBytes } from 'crypto';
import nats,{ Stan } from 'node-nats-streaming';

export class NatsWrapper{
    private _client?:Stan


    get client(){
        if(!this._client){
            throw new Error("client is not connected");
        }
        return this._client
    }

    connect(clusterId:string,clientId:string,url:string):Promise<void>{
        this._client=nats.connect(clusterId,clientId,{
            url
        })

        return new Promise((resolve,reject)=>{
            this._client!.on('connect',()=>{
                console.log("connected ")
                resolve();
            })
            this._client!.on('connection_lost',(err)=>{
                console.log("connection lost ")
                reject(err)
            })
        })
       
    }

}

export const natsWrapper = new NatsWrapper();