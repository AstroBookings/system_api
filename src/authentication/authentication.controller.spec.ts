import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';

/*
```gherkin
Feature: User Registration
  As a visitor, I want to register an account, so that I can access the system.


  Scenario: Register a new user
    Given the API is available
    When the user sends a POST request to "/api/authentication/register" with the following data:
      | name     | email                | password    | role     |
      | "John Doe" | "johndoe@example.com" | "password123" | "traveler" |
    Then the response should have a status code of 201
    And the response should contain a field "token" with a JWT value
    And the response should contain a field "user" with the user information
    And the "user" should not contain a field "password"

  Scenario: Register with an existing email
    Given the API is available
    When the user sends a POST request to "/api/authentication/register" with the following data:
      | name     | email                | password    | role     |
      | "John Doe" | "johndoe@example.com" | "password123" | "traveler" |
    Then the response should have a status code of 409
    And the response should contain an error message "Email already in use"
```
*/

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: jest.Mocked<AuthenticationService>;
  const mockedUserToken : UserTokenDto= {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      role: 'traveler',
    },
    token: 'mocked_jwt_token',
  };
  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn((x)=>{
        if(x.email == 'johndoe@repeated.com') throw new ConflictException('Email already in use');
        return mockedUserToken;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authService = module.get(AuthenticationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('User Registration', () => {
    /**
     * Test case for successful user registration
     */
    it('should register a new user successfully', async () => {
      const registerDto : RegisterDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'traveler',
      };
      const actual_result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(actual_result).toEqual(mockedUserToken);
    });

    /**
     * Test case for registration with an existing email
     */
    it('should throw conflict exception when registering with an existing email', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'johndoe@repeated.com',
        password: 'password123',
        role: 'traveler',
      };

      await expect(controller.register(registerDto)).rejects.toThrow('Email already in use');
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});