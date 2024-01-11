import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueRepository } from './queue.repository';
import { QueueService } from './queue.service';
import { MessageModule } from '../message/message.module';


@Module({
  providers: [QueueRepository, QueueService],
  controllers: [QueueController],
  imports: [MessageModule]
})
export class QueueModule { }
