import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const inputRegisterUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  role: 'traveler',
};
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

  describe('Register', () => {
    let createdUserId: string;

    // ToDo: Clean up the database before running the test (need delete by email)

    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post(`${endPoint}/register`)
        .send(inputRegisterUser)
        .expect(201);
      createdUserId = response.body.user.id;
    });

    afterEach(async () => {
      if (createdUserId) {
        const url = `${endPoint}/${createdUserId}`;
        await request(app.getHttpServer()).delete(url).expect(200);
      }
    });
  });
});
