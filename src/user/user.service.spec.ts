import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@config/prisma.service';
import { MockContext, createMockContext } from '@mocks/prisma.mock';
import { allUsersMock, userMock } from './mocks/user.mock';
import { ConfigService } from '@nestjs/config';
import { SesService } from '@aws/ses.service';

describe('UserService', () => {
    let service: UserService;
    let prisma: MockContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, PrismaService, ConfigService, SesService],
        })
            .overrideProvider(PrismaService)
            .useValue(createMockContext())
            .compile();

        service = module.get<UserService>(UserService);
        prisma = module.get<MockContext>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        it('should return a user', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockResolvedValueOnce(userMock);

            // Act
            const result = await service.findOne({
                email: 'danielalopez+client@ravn.co',
            });

            // Assert
            expect(prisma.user.findUniqueOrThrow).toHaveBeenCalled();
            expect(result).toHaveProperty('id', expect.any(Number));
        });

        it('should throw NotFound when user does not exists', async () => {
            // Arrange
            prisma.user.findUniqueOrThrow.mockRejectedValueOnce(null);

            // Act & Assert
            await expect(
                service.findOne({ email: 'danielalopez@ravn.co' })
            ).rejects.toThrow('User not found');
        });
    });

    describe('create', () => {
        it('should add user', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValueOnce(null);
            prisma.user.create.mockResolvedValueOnce(userMock);

            // Act
            const result = await service.create({
                email: 'danielalopez+admin@ravn.co',
                name: 'Daniela',
                lastname: 'Lopez',
                username: 'daniela',
                password: 'pass123',
                role: 'CLIENT',
            });

            // Assert
            expect(result).toHaveProperty('id', expect.any(Number));
            expect(prisma.user.create).toHaveBeenCalled();
        });

        it('should fail when create a new user and user already exists', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValue(userMock);

            // Act & Assert
            await expect(
                service.create({
                    email: 'danielalopez+admin@ravn.co',
                    name: 'Daniela',
                    lastname: 'Lopez',
                    username: 'daniela',
                    password: 'pass123',
                    role: 'CLIENT',
                })
            ).rejects.toThrow('User already exists');
        });
    });

    describe('findAll', () => {
        it('should find all users', async () => {
            // Arrange
            prisma.user.findMany.mockResolvedValueOnce(allUsersMock);

            const page = '1';
            const limit = '15';

            // Act
            const result = await service.findAll({ page, limit });

            // Assert
            expect(result).toMatchObject(allUsersMock);
            expect(result).toHaveLength(2);
        });
    });

    describe('update', () => {
        it('should update an user', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValueOnce(userMock);
            prisma.user.update.mockResolvedValueOnce({
                ...userMock,
                username: 'daniela',
            });

            const info = {
                username: 'daniela',
            };

            // Act
            const result = await service.update(userMock.id, info);

            // Assert
            expect(prisma.user.update).toHaveBeenCalled();
            expect(result.username).toEqual('daniela');
            expect(prisma.user.findUnique).toHaveBeenCalled();
            expect(result).toHaveProperty('id', expect.any(Number));
        });

        it('should fail when update an user that does not exists', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValue(null);

            const info = {
                username: 'daniela',
            };

            // Act & Assert
            await expect(service.update(1000, info)).rejects.toThrow(
                'User not found'
            );
        });
    });

    describe('delete', () => {
        it('should delete an user', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValueOnce(userMock);
            prisma.user.delete.mockResolvedValue(userMock);

            // Act
            const result = await service.delete(userMock.id);

            // Assert
            expect(prisma.user.delete).toHaveBeenCalledTimes(1);
            expect(result).toHaveProperty('id', expect.any(Number));
        });

        it('should fail when delete an user that does not exists', async () => {
            // Arrange
            prisma.user.findUnique.mockResolvedValueOnce(null);

            // Act & assert
            await expect(service.delete(1000)).rejects.toThrow(
                'User not found'
            );
        });
    });
});
