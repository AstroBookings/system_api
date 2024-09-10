import { LoginDto } from '@api/authentication/models/login.dto';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import * as request from 'supertest';
describe('Authentication Controller (e2e)', () => {
  let app: INestApplication;
  const authenticationEndPoint: string = '/api/authentication';
  const authenticationAdminEndPoint: string = `${authenticationEndPoint}/admin`;
  const adminEndPoint: string = `/api/admin`;
  const inputRegisterUser = {
    name: 'Test User',
    email: 'test.user@test.dev',
    password: 'Password@0',
    role: 'traveler',
  };
  const inputLoginUser: LoginDto = {
    email: 'test.user@test.dev',
    password: 'Password@0',
  };
  const invalidLoginEmail: LoginDto = {
    email: 'non.existent@test.dev',
    password: 'Password@0',
  };
  const invalidLoginPassword: LoginDto = {
    email: inputLoginUser.email,
    password: 'WrongPassword@0',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .setLogger(console)
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    console.warn('⚠️  Regenerating database before running the tests ⚠️');
    await request(app.getHttpServer()).post(`${adminEndPoint}/regenerate-db`).expect(200);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Ping', () => {
    it('should return pong', async () => {
      const pingUrl = `${authenticationEndPoint}/ping`;
      await request(app.getHttpServer()).get(pingUrl).expect(200).expect('pong');
    });
  });

  describe('Register a new user', () => {
    beforeEach(async () => {
      const deleteUrl = `${authenticationAdminEndPoint}/${inputRegisterUser.email}`;
      console.warn(`⚠️  Deleting user at: ${deleteUrl} before running register test`);
      await request(app.getHttpServer()).delete(deleteUrl);
    });
    it('should pass', async () => {
      expect(true).toBe(true);
    });
    it('should return 201 and a token if user is created', async () => {
      const registerUrl = `${authenticationEndPoint}/register`;
      await request(app.getHttpServer())
        .post(registerUrl)
        .send(inputRegisterUser)
        .expect(201)
        .expect((response) => {
          expect(response.body.token).toBeDefined();
        });
    });
    it('should return 409 if user already exists', async () => {
      const registerUrl = `${authenticationEndPoint}/register`;
      await request(app.getHttpServer())
        .post(registerUrl)
        .send(inputRegisterUser)
        .expect(201)
        .expect((response) => {
          expect(response.body.token).toBeDefined();
        });
      const register2Url = `${authenticationEndPoint}/register`;
      await request(app.getHttpServer()).post(register2Url).send(inputRegisterUser).expect(409);
    });
  });

  describe('Login user', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).delete(`${authenticationAdminEndPoint}/${inputLoginUser.email}`).expect(200);
      await request(app.getHttpServer()).post(`${authenticationEndPoint}/register`).send(inputRegisterUser).expect(201);
    });
    it('should return 200 and a token if credentials are valid', async () => {
      await request(app.getHttpServer())
        .post(`${authenticationEndPoint}/login`)
        .send(inputLoginUser)
        .expect(200)
        .expect((response: request.Response) => {
          expect(response.body.token).toBeDefined();
          expect(response.body.user).toBeDefined();
          expect(response.body.user.email).toBe(inputLoginUser.email);
        });
    });
    it('should return 401 if email is not registered', async () => {
      await request(app.getHttpServer()).post(`${authenticationEndPoint}/login`).send(invalidLoginEmail).expect(401);
    });
    it('should return 401 if password is incorrect', async () => {
      await request(app.getHttpServer()).post(`${authenticationEndPoint}/login`).send(invalidLoginPassword).expect(401);
    });
  });

  describe('Validate token', () => {
    beforeEach(async () => {
      await request(app.getHttpServer()).delete(`${authenticationAdminEndPoint}/${inputLoginUser.email}`).expect(200);
      await request(app.getHttpServer()).post(`${authenticationEndPoint}/register`).send(inputRegisterUser).expect(201);
    });
    it('should return 200 and a token if credentials are valid', async () => {
      const response = await request(app.getHttpServer()).post(`${authenticationEndPoint}/login`).send(inputLoginUser);
      const inputValidToken = response.body.token;
      await request(app.getHttpServer()).get(`${authenticationEndPoint}/validate/${inputValidToken}`).expect(200);
    });
    it('should return 401 if token is invalid', async () => {
      const inputInvalidToken = 'invalid_token';
      await request(app.getHttpServer()).get(`${authenticationEndPoint}/validate/${inputInvalidToken}`).expect(401);
    });
  });
});
