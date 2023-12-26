import { Injectable } from "@nestjs/common";
import { MessageSchema } from "./schemas/messageSchema";
import { IMessageRepository } from "./interfaces/IMessageRepository";

@Injectable()
export class MessageRepository implements IMessageRepository {
    messages: MessageSchema[]

    constructor() {
        this.messages = []
    }

    insertOne(message: MessageSchema): string {
        this.messages.push(message);
        return message.id
    }

    findMany(name: string): MessageSchema[] {
        return this.messages.filter(message => {return message.queue == name})
    }

    deleteOneById(id:string): string {
        this.messages = this.messages.filter(message =>  message.id !== id)
        return id

    }
}