import { Test } from '@nestjs/testing';
import { AuthService } from './auth.services';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { match } from 'assert';
describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  beforeEach(async () => {
    // create a fake copy of the user service
    // fakeUserService = {
    //   find: () => Promise.resolve([]),
    //   create: (email: string, password: string) =>
    //     Promise.resolve({
    //       id: 1,
    //       email,
    //       password,
    //     } as User),
    // };
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 100),
          email,
          password,
        } as User;
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });
  it('can create an instance of auth service ', async () => {
    expect(service).toBeDefined();
  });
  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('anas123@gmail.com', 'anas1234');
    expect(user.passwords).not.toEqual('ansa1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if user signs up with email that is in use', (done) => {
    fakeUserService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: 'abc' } as User]);

    service.signup('anas123@gmail.com', 'anas1234').then(() => {
      done();
    });
  });
  it('throws an error if signin is called with an unused email', (done) => {
    service.signup('anas123@gmail.com', 'anas1234').then(() => {
      done();
    });
  });
  it('throws an error if invalid password is provided', (done) => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          email: 'anas123@gmail.com',
          password: 'anas1234',
        } as User,
      ]);
    service.signin('anas123@gmail.com', 'asdsa1232').then(() => {
      done();
    });
  });
  it('returns a user if correct password is provided', async () => {
    await service.signup('anas123@gmail.com', 'anas1234');
    const user = await service.signin('anas123@gmail.com', 'anas1234');
    expect(user).toBeDefined();
  });
});
