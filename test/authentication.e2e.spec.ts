import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from 'src/api/authentication/models/login.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication Controller (e2e)', () => {
  let app: INestApplication;
  let endPoint: string = '/authentication';
  const inputRegisterUser = {
    name: 'John Doe',
    email: 'john.doe@test.dev',
    password: 'Password@123',
    role: 'traveler',
  };
  const inputLoginUser: LoginDto = {
    email: 'john.doe@test.dev',
    password: 'Password@123',
  };
  const invalidLoginEmail: LoginDto = {
    email: 'non.existent@test.dev',
    password: 'Password@123',
  };
  const invalidLoginPassword: LoginDto = {
    email: inputLoginUser.email,
    password: 'WrongPassword@123',
  };
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .setLogger(console)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe('Register a new user', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .delete(`${endPoint}/admin/${inputRegisterUser.email}`)
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

  describe('Login user', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .delete(`${endPoint}/admin/${inputLoginUser.email}`)
        .expect(200);

      await request(app.getHttpServer())
        .post(`${endPoint}/register`)
        .send(inputRegisterUser)
        .expect(201);
    });

    it('should return 200 and a token if credentials are valid', async () => {
      await request(app.getHttpServer())
        .post(`${endPoint}/login`)
        .send(inputLoginUser)
        .expect(200)
        .expect((response: request.Response) => {
          expect(response.body.token).toBeDefined();
          expect(response.body.user).toBeDefined();
          expect(response.body.user.email).toBe(inputLoginUser.email);
        });
    });

    it('should return 401 if email is not registered', async () => {
      await request(app.getHttpServer())
        .post(`${endPoint}/login`)
        .send(invalidLoginEmail)
        .expect(401);
    });

    it('should return 401 if password is incorrect', async () => {
      await request(app.getHttpServer())
        .post(`${endPoint}/login`)
        .send(invalidLoginPassword)
        .expect(401);
    });
  });

  describe('Validate token', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .delete(`${endPoint}/admin/${inputLoginUser.email}`)
        .expect(200);

      await request(app.getHttpServer())
        .post(`${endPoint}/register`)
        .send(inputRegisterUser)
        .expect(201);
    });
    it('should return 200 and a token if credentials are valid', async () => {
      const response = await request(app.getHttpServer())
        .post(`${endPoint}/login`)
        .send(inputLoginUser);
      const inputValidToken = response.body.token;
      await request(app.getHttpServer())
        .get(`${endPoint}/validate/${inputValidToken}`)
        .expect(200);
    });
    it('should return 401 if token is invalid', async () => {
      const inputInvalidToken = 'invalid_token';
      await request(app.getHttpServer())
        .get(`${endPoint}/validate/${inputInvalidToken}`)
        .expect(401);
    });
  });
});
