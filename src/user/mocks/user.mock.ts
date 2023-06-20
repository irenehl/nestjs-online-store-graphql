import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const userModMock = () => ({
    id: 1,
    email: 'danielalopez+admin@ravn.co',
    name: 'Daniela',
    lastname: 'Lopez',
    username: 'daniela',
    password: bcrypt.hashSync('pass123', 10),
    role: Role.CLIENT,
    recovery: null,
});

export const userMock = {
    ...userModMock(),
    id: 2,
    email: 'danielalopez+client@ravn.co',
    username: 'daniela2',
};

export const allUsersMock = [
    {
        id: 1,
        email: 'danielalopez@ravn.co',
        name: 'Daniela',
        lastname: 'Huezo',
        username: 'daniela1',
        role: Role.CLIENT,
        password: 'pass123',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
        recovery: null,
    },
    {
        id: 2,
        email: 'danielalopez+1@ravn.co',
        name: 'Daniela',
        lastname: 'Huezo',
        username: 'daniela2',
        role: Role.CLIENT,
        password: 'pass123',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
        recovery: null,
    },
];

export const updatedUserMock = {
    email: 'danielalopez+client@ravn.co',
    name: 'Daniela',
    lastname: 'Lopez',
    username: 'daniela',
};

export const userPayloadMock = {
    sub: '1',
    email: 'danielalopez+client@ravn.co',
    role: 'CLIENT' as Role,
};
