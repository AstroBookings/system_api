import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../models/user.type';
import { AuthenticationService } from '../services/authentication.service';
import { AdminController } from './admin.controller';

describe('AdminController', () => {
  let controller: AdminController;
  let mockAuthService: Partial<jest.Mocked<AuthenticationService>>;

  const mockId: string = '1';
  const mockToken: string = 'mock_jwt_token';
  const mockExp: number = 1756074366;
  const mockEmail = 'john.doe@test.dev';
  const mockUser: User = {
    id: mockId,
    name: 'John Doe',
    email: mockEmail,
    role: 'traveler',
  };

  beforeEach(async () => {
    mockAuthService = {
      validate: jest.fn(),
      getById: jest.fn(),
      deleteUserByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthService,
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
      mockAuthService.getById.mockResolvedValue(mockUser);

      // Act
      const actualResult: User = await controller.getUser(mockId);

      // Assert
      expect(mockAuthService.getById).toHaveBeenCalledWith(mockId);
      expect(actualResult).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      mockAuthService.getById.mockRejectedValue(new NotFoundException(`User with ID ${mockId} not found`));

      // Act & Assert
      await expect(controller.getUser(mockId)).rejects.toThrow(NotFoundException);
      expect(mockAuthService.getById).toHaveBeenCalledWith(mockId);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by email successfully', async () => {
      // Arrange

      mockAuthService.deleteUserByEmail.mockResolvedValue(undefined);

      // Act
      await controller.deleteUser(mockEmail);

      // Assert
      expect(mockAuthService.deleteUserByEmail).toHaveBeenCalledWith(mockEmail);
    });

    it('should not throw an error if user does not exist', async () => {
      // Arrange
      const inputInvalidEmail = 'nonexistent@test.dev';
      mockAuthService.deleteUserByEmail.mockResolvedValue(undefined);

      // Act & Assert
      await expect(controller.deleteUser(inputInvalidEmail)).resolves.not.toThrow();
      expect(mockAuthService.deleteUserByEmail).toHaveBeenCalledWith(inputInvalidEmail);
    });
  });
});
