import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { QueueModule } from './../src/queue/queue.module';
import { setupApp } from '../src/setup-app';

describe('Queue Controller REST Requests.', () => {
    let app: INestApplication;

    const messages = [{
        "platform": "SMS",
        "message": "Sending messageOne with 1 recipient.",
        "Recipients": ["0501111111"]
    }, 
    {
        "platform": "SMS",
        "message": "Sending messageTwo with 2 recipients",
        "Recipients": ["0501111111", "0502222222"]
    }]


    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [QueueModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        setupApp(app);
        await app.init();
    });

    it('Handles creating queue', () => {
        const queueName = 'myQueue'

        return request(app.getHttpServer())
            .post('/queue')
            .send({ "name": queueName })
            .expect(201)
            .then((response) => {
                const name = response.body.data;
                expect(name).toEqual('myQueue')

                return request(app.getHttpServer())
                    .post('/queue')
                    .send({ "name": queueName })
                    .expect(409)
            })
    });



    it('Handles ADDING a message to queue (Before and after queue is being created)', () => {
        const queueName = 'myQueue'
        const message = {
            "platform": "SMS",
            "message": "I am expecting an error to be thrown",
            "Recipients": ["0501111111"]
        }

        return request(app.getHttpServer())

            .post(`/queue/name/${queueName}/message`)
            .send(message)
            .expect(404)
            .then(() => {
                return request(app.getHttpServer())
                    .post('/queue')
                    .send({ "name": queueName })
                    .expect(201)
                    .then(() => {

                        return request(app.getHttpServer())
                            .post(`/queue/name/${queueName}/message`)
                            .send(message)
                            .then((response) => {
                                const id = response.body.data
                                expect(id).toBeDefined;
                            })
                    })
            })
    });


    it('Verifies that the highest number of recipient tasks are being executed first.', () => {
        const queueName = 'myQueue'
        const executedTasks = []
        
        return request(app.getHttpServer())
        .post('/queue')
        .send({ "name": queueName })
        .expect(201)

        .then(() => {
            return request(app.getHttpServer())
                .post(`/queue/name/${queueName}/message`)
                .send(messages[0])
                .then((response) => {
                    executedTasks.push(response.body.data);

                    return request(app.getHttpServer())
                        .post(`/queue/name/${queueName}/message`)
                        .send(messages[1])
                        .then((response) => {
                            executedTasks.push(response.body.data);

                            return request(app.getHttpServer())
                                .post(`/queue/name/${queueName}/execute`)
                                .then((response) => {
                                    const ids = response.body.data
                                    expect(ids[0]).toEqual(executedTasks[1])
                                    expect(ids[1]).toEqual(executedTasks[0])
                                })
                                
                        })
                })
        })

    });


    it('Handles EXECUTING all messages from a queue. \
        And then executing again to verify that queue is empty.', () => {
        const queueName = 'myQueue'


        return request(app.getHttpServer())
            .post('/queue')
            .send({ "name": queueName })
            .expect(201)

            .then(() => {
                return request(app.getHttpServer())
                    .post(`/queue/name/${queueName}/message`)
                    .send(messages[0])
                    .then(() => {
                        return request(app.getHttpServer())
                            .post(`/queue/name/${queueName}/message`)
                            .send(messages[1])
                            .then(() => {
                                return request(app.getHttpServer())
                                    .post(`/queue/name/${queueName}/execute`)
                                    .then((response) => {
                                        const ids = response.body.data
                                        expect(ids.length).toEqual(messages.length)
                                    })
                                    .then(() => {
                                        return request(app.getHttpServer())
                                            .post(`/queue/name/${queueName}/execute`)
                                            .then((response) => {
                                                const ids = response.body.data
                                                expect(ids.length).toEqual(0)
                                            })
                                    })

                            })
                    })
            })

    });
});


