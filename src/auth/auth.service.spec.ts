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
    let ses: SesService;

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
        ses = module.get<SesService>(SesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('should generate a token from an user', async () => {
            // Arrange

            prisma.user.findUniqueOrThrow.mockResolvedValueOnce(userMock);

            // Act
            const result = await service.login({
                email: 'danielalopez+client@ravn.co',
                password: 'pass123',
            });

            // Assert
            expect(result).toHaveProperty('access_token', expect.any(String));
        });

        it('should fail when receive wrong credentials', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValue(userMock);

            // Act && Assert
            expect(
                service.login({
                    email: 'danielalopez+client@ravn.co',
                    password: 'pass123!!!',
                })
            ).rejects.toThrow('Wrong credentials');
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
            expect(ses.sendEmail).toHaveBeenCalled();
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
            const result = await service.resetHandler({
                password: '123',
                token: 'token',
            });

            // Assert
            expect(result).toHaveProperty('recovery');
            expect(result.recovery).toEqual(null);
        });

        it('should fail when there is no token', async () => {
            // Arrange, Act & Assert
            await expect(
                service.resetHandler({
                    password: '1',
                    token: null as unknown as string,
                })
            ).rejects.toThrow('Token is invalid');
        });
    });
});
