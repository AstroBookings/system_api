import { User } from '@api/authentication/models/user.type';
import { AuthenticationService } from '@api/authentication/services/authentication.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';

describe('AdminController', () => {
  let controller: AdminController;
  let mockAuthService: Partial<jest.Mocked<AuthenticationService>>;

  const mockId: string = '1';
  const mockEmail = 'john.doe@test.dev';
  const mockUser: User = {
    id: mockId,
    name: 'John Doe',
    email: mockEmail,
    role: 'traveler',
  };

  beforeEach(async () => {
    mockAuthService = {
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
    // Assert: Verify that the controller is defined
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should get a user by id successfully', async () => {
      // Arrange: Set up the mock return value for the service
      mockAuthService.getById.mockResolvedValue(mockUser);

      // Act: Call the method under test
      const actualResult: User = await controller.getUser(mockId);

      // Assert: Verify the expected outcome
      expect(mockAuthService.getById).toHaveBeenCalledWith(mockId);
      expect(actualResult).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange: Set up the service to throw NotFoundException
      mockAuthService.getById.mockRejectedValue(new NotFoundException(`User with ID ${mockId} not found`));

      // Act & Assert: Expect the method to throw an exception
      await expect(controller.getUser(mockId)).rejects.toThrow(NotFoundException);
      expect(mockAuthService.getById).toHaveBeenCalledWith(mockId);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by email successfully', async () => {
      // Arrange: Set up the service to resolve successfully
      mockAuthService.deleteUserByEmail.mockResolvedValue(undefined);

      // Act: Call the method under test
      await controller.deleteUser(mockEmail);

      // Assert: Verify the expected outcome
      expect(mockAuthService.deleteUserByEmail).toHaveBeenCalledWith(mockEmail);
    });

    it('should not throw an error if user does not exist', async () => {
      // Arrange: Set up an invalid email
      const inputInvalidEmail = 'nonexistent@test.dev';
      mockAuthService.deleteUserByEmail.mockResolvedValue(undefined);

      // Act & Assert: Expect no error to be thrown
      await expect(controller.deleteUser(inputInvalidEmail)).resolves.not.toThrow();
      expect(mockAuthService.deleteUserByEmail).toHaveBeenCalledWith(inputInvalidEmail);
    });
  });
});
