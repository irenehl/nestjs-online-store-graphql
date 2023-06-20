import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@config/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MockContext, createMockContext } from '@mocks/prisma.mock';
import { userMock } from '@user/mocks/user.mock';
import { SesService } from '@aws/ses.service';
import { S3Service } from '@aws/s3.service';
import { createS3Mock } from '@mocks/s3.mock';
import { createSESMock } from '@mocks/ses.mock';

describe('AuthService', () => {
    let service: AuthService;
    let prisma: MockContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                PrismaService,
                ConfigService,
                UserService,
                JwtService,
                SesService,
            ],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .overrideProvider(S3Service)
            .useValue(createS3Mock())
            .overrideProvider(SesService)
            .useValue(createSESMock())
            .compile();

        service = module.get<AuthService>(AuthService);
        prisma = module.get<MockContext>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should validate an user', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValueOnce(userMock);

            // Act
            const result = await service.validateUser(
                userMock.email,
                'pass123'
            );

            // Assert
            expect(prisma.user.findUniqueOrThrow).toHaveBeenCalled();
            expect(result).toHaveProperty('id', expect.any(Number));
        });

        it('should fail when validate an user', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValue(userMock);

            // Act
            const result = await service.validateUser(userMock.email, 'pass');

            // Act && Assert
            expect(result).toEqual(false);
        });
    });

    describe('login', () => {
        it('should generate a token from an user', async () => {
            // Arrange
            const result = await service.login(userMock);

            // Act & Assert
            expect(result).toHaveProperty('access_token', expect.any(String));
        });
    });

    describe('resetRequest', () => {
        it('should return a user with a recovery token', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValue(userMock);
            prisma.user.update.mockResolvedValueOnce({
                ...userMock,
                recovery: 'token',
            });

            // Act
            const result = await service.resetRequest({
                email: 'danielalopez@ravn.co',
            });

            // Assert
            expect(result).toHaveProperty('recovery');
            expect(result.recovery).toEqual('token');
        });
    });

    describe('resetHandler', () => {
        it('should handle the password change and nullify the token', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValue(userMock);
            prisma.user.update.mockResolvedValueOnce({
                ...userMock,
                recovery: null,
                password: '123',
            });

            // Act
            const result = await service.resetHandler(
                {
                    password: '123',
                },
                'token'
            );

            // Assert
            expect(result).toHaveProperty('recovery');
            expect(result.recovery).toEqual(null);
        });

        it('should fail when there is no token', async () => {
            // Arrange, Act & Assert
            await expect(
                service.resetHandler(
                    { password: '1' },
                    null as unknown as string
                )
            ).rejects.toThrow('Token is invalid');
        });
    });
});
