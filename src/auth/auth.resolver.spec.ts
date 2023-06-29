import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserService } from '@user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@config/prisma.service';
import { SesService } from '@aws/ses.service';
import { createSESMock } from '@mocks/ses.mock';

describe('AuthResolver', () => {
    let resolver: AuthResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthResolver,
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn(() => ({
                            access_token: 'token',
                        })),
                    },
                },
            ],
        }).compile();

        resolver = module.get<AuthResolver>(AuthResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('login', () => {
        it('should login an user', async () => {
            expect(
                await resolver.login({
                    email: 'example@example.com',
                    password: 'test',
                })
            ).toBeDefined();
        });
    });
});
