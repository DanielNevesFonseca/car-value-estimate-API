import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Group Test by given name
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // CREATE FAKE COPY OF USERS SERVICES
    const usersList: User[] = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = usersList.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        usersList.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Creates new user with a salted an hashed password', async () => {
    const user = await service.signup('teste@mail.com', '123456789');

    expect(user.password).not.toEqual('123456789');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  // it('throws an error if user signs up with email that is in use', async () => {
  //   fakeUsersService.find = () =>
  //     Promise.resolve([
  //       { id: 1, email: 'teste2@mail.com', password: '123456789' } as User,
  //     ]);

  //   await expect(service.signup('teste@mail.com', '123456789')).rejects.toThrow(
  //     BadRequestException,
  //   );
  // });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  // it('throws an error if signin is called with an unused email', async () => {
  //   await expect(service.signin('teste@mail.com', '123456789')).rejects.toThrow(
  //     NotFoundException,
  //   );
  // });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  // it('throws an error if an invalid password is provided', async () => {
  //   fakeUsersService.find = () =>
  //     Promise.resolve([
  //       { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
  //     ]);
  //   await expect(service.signin('asdf@asdf.com', 'laskdjf')).rejects.toThrow(
  //     BadRequestException,
  //   );
  // });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });
  it('Returns a user if correct password is provided', async () => {
    await service.signup('teste@mail.com', '123456789');

    const user = await service.signin('teste@mail.com', '123456789');
    expect(user).toBeDefined();
  });
});
