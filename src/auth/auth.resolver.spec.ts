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
                AuthService,
                UserService,
                JwtService,
                ConfigService,
                PrismaService,
                SesService,
            ],
        })
            .overrideProvider(SesService)
            .useValue(createSESMock())
            .compile();

        resolver = module.get<AuthResolver>(AuthResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
