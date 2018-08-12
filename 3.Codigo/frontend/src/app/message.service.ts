import { Injectable } from '@angular/core';
import { Subject, Observable } from "rxjs";


export enum MessageType {

    WARNING = "warning",
    DANGER = "danger",
    SUCCESS = "success"


}


export interface Message {
    type: MessageType
    persist: boolean
    text: string
    ttlInSeconds?: number
}

@Injectable()
export class MessageService {

    private _messages: Subject<Message> = new Subject();

    constructor() { }

    public sendMessage(d: Message) {

        this._messages.next(d);

    }

    get messages(): Observable<Message> {

        return this._messages.asObservable();

    }


}
