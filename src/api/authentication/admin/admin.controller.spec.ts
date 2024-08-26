import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../models/user.type';
import { AuthenticationService } from '../services/authentication.service';
import { AdminController } from './admin.controller';

describe('AdminController', () => {
  let controller: AdminController;
  let stubAuthService: Partial<jest.Mocked<AuthenticationService>>;

  const stubId: string = '1';
  const stubToken: string = 'stub_jwt_token';
  const stubExp: number = 1756074366;
  const stubEmail = 'john.doe@test.dev';
  const stubUser: User = {
    id: stubId,
    name: 'John Doe',
    email: stubEmail,
    role: 'traveler',
  };

  beforeEach(async () => {
    stubAuthService = {
      validate: jest.fn(),
      getById: jest.fn(),
      deleteUserByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: stubAuthService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should get a user by id successfully', async () => {
      // Arrange
      stubAuthService.getById.mockResolvedValue(stubUser);

      // Act
      const actualResult: User = await controller.getUser(stubId);

      // Assert
      expect(stubAuthService.getById).toHaveBeenCalledWith(stubId);
      expect(actualResult).toEqual(stubUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      stubAuthService.getById.mockRejectedValue(
        new NotFoundException(`User with ID ${stubId} not found`),
      );

      // Act & Assert
      await expect(controller.getUser(stubId)).rejects.toThrow(
        NotFoundException,
      );
      expect(stubAuthService.getById).toHaveBeenCalledWith(stubId);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by email successfully', async () => {
      // Arrange

      stubAuthService.deleteUserByEmail.mockResolvedValue(undefined);

      // Act
      await controller.deleteUser(stubEmail);

      // Assert
      expect(stubAuthService.deleteUserByEmail).toHaveBeenCalledWith(stubEmail);
    });

    it('should not throw an error if user does not exist', async () => {
      // Arrange
      const inputInvalidEmail = 'nonexistent@test.dev';
      stubAuthService.deleteUserByEmail.mockResolvedValue(undefined);

      // Act & Assert
      await expect(
        controller.deleteUser(inputInvalidEmail),
      ).resolves.not.toThrow();
      expect(stubAuthService.deleteUserByEmail).toHaveBeenCalledWith(
        inputInvalidEmail,
      );
    });
  });
});
