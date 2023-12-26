
export interface IQueueRepository {

    queue: Set<string>;

    create(name: string): string;

    findOneByName(name: string): string | null
}