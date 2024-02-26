import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const mockEmail = '123456@mail.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: mockEmail, password: '123456789' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(mockEmail);
      });
  });

  it('Signup as a new user, then get the currently logged in user', async () => {
    const mockEmail = 'test@mail.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: mockEmail, password: '123456789' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/signeduser')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(mockEmail);
  });
});
