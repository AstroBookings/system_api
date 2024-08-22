import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Authentication', () => {
    /**
     * @type {string}
     */
    let createdUserId: string;

    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/authentication/register')
        .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123', role: 'traveler' })
        .expect(201);
      console.log(response.body);
      createdUserId = response.body.user.id; 
    });

    afterEach(async () => {
      if (createdUserId) {
        const url = `/authentication/${createdUserId}`;
        console.log(url);
        await request(app.getHttpServer())
          .delete(url)
          .expect(200);
      }
    });
  });
});