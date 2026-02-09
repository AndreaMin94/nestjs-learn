import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

jest.mock('bcrypt', () => ({
    genSalt: jest.fn().mockResolvedValue('someSalt'),
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockResolvedValue(true)
}));

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockJwtService = Partial<Record<keyof JwtService, jest.Mock>>

let mockJwtService = {
    signAsync: jest.fn()
};
let mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn()
};

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: MockJwtService;
    let userRepository: MockRepository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository
                },
            ],
        }).compile();

        service = module.get(AuthService);
        userRepository = module.get(getRepositoryToken(User))
        jwtService = module.get(JwtService)
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signUp', () => {
        it('should throw ConflictException if email is in use', async () => {
            // Arrange
            const signUpDto = { email: 'test@example.com', password: 'password123' };
            userRepository.save?.mockRejectedValue({
                code: "23505",
                detail: 'Key (email)=(test@example.com) already exists.',
            })

            // Act
            const signUpAction = service.signUp(signUpDto);

            // Assert
            await expect(signUpAction).rejects.toThrow(ConflictException);
        });

        it('should throw an error if an unexpected error occurs', async () => {
            // Arrange
            const signUpDto = { email: 'test@example.com', password: 'password123' };
            userRepository.save?.mockRejectedValue(new Error('Unexpected error'));

            // Act
            const signUpAction = service.signUp(signUpDto);

            // Assert
            await expect(signUpAction).rejects.toThrow(Error)
        });

        it('should create a new user with a hashed password if the email is not in use', async () => {
            // Arrange
            const signUpDto = { email: 'test@example.com', password: 'password123' };
            userRepository.create?.mockImplementation((userData) => ({ ...userData }));
            userRepository.save?.mockResolvedValue({})

            // Act
            const signUpAction = service.signUp(signUpDto);

            // Assert
            await expect(signUpAction).resolves.not.toThrow();
            expect(userRepository.create).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'hashedPassword'
            });
            expect(userRepository.save).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'hashedPassword'
            });
        })
    })

    describe('signIn', () => {
        it("should throw UnauthorizedException if email doesn't exist", async () => {
            // Arrange
            const signInDto = { email: 'invalid@example.com', password: 'wrongPassword' };
            userRepository.findOneBy?.mockResolvedValue(null);

            // Act
            const signInAction = service.signIn(signInDto);

            // Assert
            await expect(signInAction).rejects.toThrow(UnauthorizedException)
        });
    })


})
