import { Subjects } from './subjects';
import { Stan } from 'node-nats-streaming';

interface Event{
    subject: Subjects,
    data: any
}

export abstract class Publisher<T extends Event>{

    private _client:Stan;
    abstract subject: T['subject'];

    constructor(_client:Stan){
        this._client=_client;
    }

    publish(data:T['data']):Promise<void>{
        return new Promise((resolve,reject)=>{
            this._client.publish(this.subject,JSON.stringify(data),(err)=>{
                if(err){
                    return reject(err)
                }
                console.log('Event published to subject', this.subject);
                resolve();
            })
        })
    }
}