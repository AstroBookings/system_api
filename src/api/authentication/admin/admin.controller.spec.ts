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
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should get a user by id successfully', async () => {
      mockAuthService.getById.mockResolvedValue(mockUser);
      const actualResult: User = await controller.getUser(mockId);
      expect(mockAuthService.getById).toHaveBeenCalledWith(mockId);
      expect(actualResult).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockAuthService.getById.mockRejectedValue(new NotFoundException(`User with ID ${mockId} not found`));
      await expect(controller.getUser(mockId)).rejects.toThrow(NotFoundException);
      expect(mockAuthService.getById).toHaveBeenCalledWith(mockId);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by email successfully', async () => {
      mockAuthService.deleteUserByEmail.mockResolvedValue(undefined);
      await controller.deleteUser(mockEmail);
      expect(mockAuthService.deleteUserByEmail).toHaveBeenCalledWith(mockEmail);
    });

    it('should not throw an error if user does not exist', async () => {
      const inputInvalidEmail = 'nonexistent@test.dev';
      mockAuthService.deleteUserByEmail.mockResolvedValue(undefined);
      await expect(controller.deleteUser(inputInvalidEmail)).resolves.not.toThrow();
      expect(mockAuthService.deleteUserByEmail).toHaveBeenCalledWith(inputInvalidEmail);
    });
  });
});
