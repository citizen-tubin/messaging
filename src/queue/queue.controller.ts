import { Controller, Post, Body, Param } from '@nestjs/common';
import { CreateQueueDto } from './dtos/create-queue.dto';
import { MessageDto } from '../message/dtos/message.dto';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {

    constructor(public queueService: QueueService) { }

    @Post('')
    create(@Body() queue: CreateQueueDto) {
        const name = this.queueService.create(queue.name)
        return { data: name }
    }

    @Post('/name/:queue_name/message')
    addMessage(@Param('queue_name') queueName: string, @Body() message: MessageDto) {
        const result = this.queueService.addMessage(queueName, message)
        return { data: result }

    }

    @Post('/name/:queue_name/execute')
    execute(@Param('queue_name') queueName: string) {
        const set: Set<string> = this.queueService.execute(queueName)
        const ids = Array.from(set)
        if (!ids.length) console.log(`Queue ${queueName} is empty`)
        return { data: ids}
    }


}
