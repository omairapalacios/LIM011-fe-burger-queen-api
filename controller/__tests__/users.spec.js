// const database = require('../../connection/connect_db');
const database = require('../../connection/__mocks__/globalSetup');
const {
  createUser,
} = require('../../controller/users');


describe('createUsers', () => {
  beforeAll(() => database()
    .then((db) => db));
  afterAll(() => database()
    .then((db) => db.collection('users')
      .then((collecctionUser) => collecctionUser.deleteMany({}))));

  it('should create a new user', (done) => {
    const req = {
      body: {
        email: 'test@test.com',
        password: 'wxyz',
        roles: {
          admin: false,
        },
      },
    };
    const resp = {
      send: (response) => {
        expect(response.email).toBe('test@test.com');
        expect(response.roles.admin).toBe(false);
      },
    };
    done();
    const next = (code) => code;
    createUser(req, resp, next);
  });
  it('should show an error 400 if not send email', (done) => {
    const req = {
      body: {
        password: 'wxyz',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
    };
    done();
    createUser(req, {}, next);
  });
  it('should show an error 400 when email is not valid', (done) => {
    const req = {
      body: {
        email: 'test@test',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
    };
    done();
    createUser(req, {}, next);
  });
  it('should show an error 400 when password have less than 4 characters', (done) => {
    const req = {
      body: {
        email: 'test@test',
        password: '123',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
    };
    done();
    createUser(req, {}, next);
  });
});
