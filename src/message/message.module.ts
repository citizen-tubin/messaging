import { Module } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  providers: [MessageRepository, MessageService],
  exports: [MessageRepository, MessageService]
})
export class MessageModule {}
