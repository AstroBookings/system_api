import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication Controller (e2e)', () => {
  let app: INestApplication;
  let endPoint: string = '/authentication';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Register a new user', () => {
    const inputRegisterUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'traveler',
    };
    beforeEach(async () => {
      await request(app.getHttpServer())
        .delete(`${endPoint}/${inputRegisterUser.email}`)
        .expect(200);
    });

    it('should return 201 and a token if user is created', async () => {
      await request(app.getHttpServer())
        .post(`${endPoint}/register`)
        .send(inputRegisterUser)
        .expect(201)
        .expect((response) => {
          expect(response.body.token).toBeDefined();
        });
    });
    it('should return 409 if user already exists', async () => {
      await request(app.getHttpServer())
        .post(`${endPoint}/register`)
        .send(inputRegisterUser);
      await request(app.getHttpServer())
        .post(`${endPoint}/register`)
        .send(inputRegisterUser)
        .expect(409);
    });
  });
});
