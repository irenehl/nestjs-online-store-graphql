import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '@config/prisma.service';
import { ConfigService } from '@nestjs/config';
import { allUsersMock, userMock } from './mocks/user.mock';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        create: jest.fn(() => ({
                            userMock,
                        })),
                        findOne: jest.fn(() => ({
                            userMock,
                        })),
                        findAll: jest.fn(() => ({
                            allUsersMock,
                        })),
                        update: jest.fn(() => ({
                            userMock,
                        })),
                        delete: jest.fn(() => ({
                            userMock,
                        })),
                    },
                },
                PrismaService,
                ConfigService,
            ],
            controllers: [UserController],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should created user method be defined', async () => {
            expect(await controller.create(userMock)).toBeDefined();
        });
    });

    describe('findOne', () => {
        it('should return an user method be defined', async () => {
            expect(await controller.findOne('1')).toBeDefined();
        });
    });

    describe('findAll', () => {
        it('should return all users method be defined', async () => {
            expect(await controller.findAll('1', '15')).toBeDefined();
        });
    });

    describe('update', () => {
        it('should return an updated user method be defined', async () => {
            expect(
                await controller.update('1', { username: 'updated username' })
            ).toBeDefined();
        });
    });

    describe('delete', () => {
        it('should return a deleted user method be defined', async () => {
            expect(await controller.delete('1')).toBeDefined();
        });
    });
});
