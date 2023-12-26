import { Injectable } from "@nestjs/common";
import { MessageDto } from "./dtos/message.dto";
import { convertMessageDtoToSchema } from "./helpers/funcs";
import { MessageSchema } from "./schemas/messageSchema";
import { PlatformEnum } from "./enums/platform.entity";
import { Email } from "./objects/email";
import { Sms } from "./objects/sms";
import { MessageRepository } from "./message.repository";

@Injectable()
export class MessageService {
    constructor(public messageRepository: MessageRepository) { }

    insertOne(queue: string, message: MessageDto): string {
        const messageSchema: MessageSchema = convertMessageDtoToSchema(queue, message)
        return this.messageRepository.insertOne(messageSchema)
    }

    findMany(queue: string) {
        return this.messageRepository.findMany(queue);
    }

    executeAndPop(message: MessageSchema): string {
        switch (message.platform) {
            case PlatformEnum.Email:
                message.Recipients.forEach(recipient => {
                    const mail: Email = new Email(recipient, message.subject, message.message)
                    mail.send()
                })
                break;
            case PlatformEnum.SMS:
                message.Recipients.forEach(recipient => {
                    const sms: Sms = new Sms(recipient, message.message)
                    sms.send()
                })
                break;
        }

        return this.messageRepository.deleteOneById(message.id)


    }
}