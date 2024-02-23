import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'teste@mail.com',
          password: '123456789',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: '123456789' } as User,
        ]);
      },
      // remove: () => {},
      // update: () => {},
    };

    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('teste@mail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('teste@mail.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('Signin updates session object and returns user', async () => {
    const session = { userId: -1 };
    const user = await controller.signin(
      { email: 'teste@mail.com', password: '123456789' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  // OLD WAY TO IMPLEMENT
  // it('findUser throws an error if user with given id is not found', async (done) => {
  //   fakeUsersService.findOne = () => null;
  //   try {
  //     await controller.findUser('1');
  //   } catch (err) {
  //     done();
  //   }
  // });

  // it('findUser throws an error if user with given id is not found', async () => {
  //   fakeUsersService.findOne = () => null;
  //   await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
  // });
});
