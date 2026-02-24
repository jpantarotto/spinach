import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SafeUser } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUser: SafeUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    username: 'testuser',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockAuthResponse = {
    user: mockUser,
    accessToken: 'mock-jwt-token',
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('register', () => {
    it('should register a new user and return user with access token', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      authService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockAuthResponse);
      expect(result.accessToken).toBeDefined();
      expect(result.user.email).toBe(registerDto.email);
    });
  });

  describe('login', () => {
    it('should login user and return user with access token', () => {
      const req = { user: mockUser };

      authService.login.mockReturnValue(mockAuthResponse);

      const result = controller.login(req);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockAuthResponse);
      expect(result.accessToken).toBeDefined();
      expect(result.user).toEqual(mockUser);
    });
  });
});
