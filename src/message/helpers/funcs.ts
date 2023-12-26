import { MessageDto } from "../dtos/message.dto";
import { MessageSchema } from "../schemas/messageSchema";

export function convertMessageDtoToSchema(queue: string, message: MessageDto): MessageSchema {
    return new MessageSchema(queue, message.platform , message.message, message.Recipients, message.subject)
}