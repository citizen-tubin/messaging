import { ConflictException, Injectable } from "@nestjs/common";
import { IQueueRepository } from "./interfaces/IQueueRepository";


@Injectable()
export class QueueRepository implements IQueueRepository {
    queue: Set<string>;

    constructor() {
        this.queue = new Set();
      }
    
    create(name:string): string {
        if (this.queue.has(name)) {
            throw new ConflictException("Queue with provided name already exists. Please name your queue differently.")
        }
        this.queue.add(name);
        return name
    }

    findOneByName(name: string): string | null {
        return  this.queue.has(name)? name : null;
    }
}