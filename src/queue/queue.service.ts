import { Injectable, NotFoundException } from "@nestjs/common";
import { QueueRepository } from "./queue.repository";
import { MessageDto } from "../message/dtos/message.dto";
import { MessageService } from "../message/message.service";
import { MessageSchema } from "../message/schemas/messageSchema";
import { sortTasksByReceipients } from "./helpers/funcs";

@Injectable()
export class QueueService {

    constructor(public messageService: MessageService, public queueRepository: QueueRepository) {}

    create(name: string) {
        return this.queueRepository.create(name)
    }

    addMessage(queue: string, message: MessageDto): string {
        const queueName = this.queueRepository.findOneByName(queue)
        if (!queueName) throw new NotFoundException('Queue name not found')

        return this.messageService.insertOne(queueName,message);
    }

    execute(name: string): Set<string> {
        const queueName = this.queueRepository.findOneByName(name)
        if (!queueName) throw new NotFoundException('Queue name not found')
        
        const executedTasks = new Set<string>();
        const messages: MessageSchema[] = this.messageService.findMany(queueName)
        const sortedMessages = sortTasksByReceipients(messages)
        
        sortedMessages.forEach(message=> { 
            const id: string = this.messageService.executeAndPop(message)
            executedTasks.add(id);
        })
        return executedTasks
    }

}