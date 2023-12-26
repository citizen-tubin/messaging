import { MessageSchema } from "../schemas/messageSchema";

export interface IMessageRepository {

    messages: MessageSchema[]

    insertOne(message: MessageSchema): string

    findMany(name: string): MessageSchema[]

    deleteOneById(id:string): string
}