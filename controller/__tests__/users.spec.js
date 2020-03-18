const database = require('../../connection/__mocks__/globalSetup');

let db;
const {
  createUser,
  getUserUid,
  getUsers,
  updateUserUid,
  deleteUser,
} = require('../users');

beforeAll(async () => {
  db = await database();
  const collectionUsers = await db.collection('users');
  await collectionUsers.deleteMany({});
  // await db.stop();
});
/* afterEach(async () => {
  db = await database();
  const collectionUsers = await db.collection('users');
  await collectionUsers.deleteMany({});
}); */
describe('createUsers', () => {
  it('should create a new user', (done) => {
    const req = {
      body: {
        email: 'test1@test.com',
        password: '123456',
        roles: {
          admin: false,
        },
      },
    };
    const resp = {
      send: (response) => {
        expect(response.email).toBe('test1@test.com');
        expect(response.roles.admin).toBe(false);
      },
    };
    const next = (code) => code;
    done();
    return createUser(req, resp, next);
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
      done();
    };
    createUser(req, {}, next);
  });
  it('should show an error 400 when email is not valid', (done) => {
    const req = {
      body: {
        email: 'test@test',
        password: '12345',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
      done();
    };
    createUser(req, {}, next);
  });
  it('should show an error 400 when password have less than 4 characters', (done) => {
    const req = {
      body: {
        email: 'test@test.com',
        password: '12',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
      done();
    };
    createUser(req, {}, next);
  });
  it('should show an error 400 if user is not exists', (done) => {
    const req = {
      body: {
        email: 'test@test.com',
        password: 't123',
      },
    };

    const next = (code) => {
      expect(code).toBe(400);
      done();
    };

    createUser(req, {}, next);
  });
});

describe('getUserUid', () => {
  it('should show an error 400 if user is not exists', (done) => {
    const req = {
      params: {
        uid: 'user5@test.com',
      },
    };

    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    getUserUid(req, {}, next);
  });
  it('should get an user', (done) => {
    const req = {
      params: {
        uid: 'test@test.com',
      },
    };
    const resp = {
      send: (response) => {
        // expect(response._id).toBe('test@test.com');
        expect(response.email).toBe('test@test.com');
        expect(response.roles).toBe(false);
      },
    };
    const next = (code) => code;
    done();
    getUserUid(req, resp, next);
  });
});

describe('updateUserUid', () => {
  it('should show an error 403 if user is not admin', (done) => {
    const req = {
      params: {
        uid: 'test@test.com',
      },
      headers: {
        user: {
          roles: {
            admin: false,
          },
        },
      },
      body: {
        email: 'test@test.com',
        password: '12345',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(403);
      done();
    };
    updateUserUid(req, {}, next);
  });

  it('should show an error 404 if user not exists', (done) => {
    const user = undefined;
    const req = {
      params: {
        uid: 'user8@test.com',
      },
      headers: {
        user: {
          roles: {
            admin: false,
          },
        },
      },
      body: {
        email: 'user8@test.com',
        password: '12345',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(user).toBe(undefined);
      expect(code).toBe(404);
      done();
    };
    updateUserUid(req, {}, next);
  });


  it('should show an error 400 if email and password not exists', (done) => {
    const req = {
      params: {
        uid: 'test@test.com',
      },
      headers: {
        user: {
          roles: {
            admin: true,
          },
        },
      },
      body: {
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
      done();
    };
    updateUserUid(req, {}, next);
  });

  it('should update an user', (done) => {
    const user = {
      email: 'test@test.com',
      password: '1234567',
      rol: {
        admin: false,
      },
    };
    const req = {
      params: {
        uid: 'test@test.com',
      },
      headers: {
        user: {
          roles: {
            admin: true,
          },
        },
      },
      body: {
        email: 'test@test.com',
        password: '12345',
        roles: {
          admin: false,
        },
      },
    };
    const resp = {
      send: (response) => {
        expect(response.email).toBe(user.email);
      },
    };
    const next = (code) => code;
    done();
    updateUserUid(req, resp, next);
  });
});


describe('deleteUser', () => {
  it('should show an error 404 if user not exists', (done) => {
    const user = undefined;
    const req = {
      params: {
        uid: 'user8@test.com',
      },
      headers: {
        user: {
          roles: {
            admin: false,
          },
        },
      },
      body: {
        email: 'user8@test.com',
        password: '12345',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(user).toBe(undefined);
      expect(code).toBe(404);
      done();
    };
    deleteUser(req, {}, next);
  });


  it('should delete an user', (done) => {
    const req = {
      params: {
        uid: 'user@test.com',
      },
      headers: {
        user: {
          roles: {
            admin: true,
          },
        },
      },
      body: {
        roles: {
          admin: false,
        },
      },
    };
    const resp = {
      send: (response) => {
        expect(response.message).toBe('usuario eliminado exitosamente');
      },
    };
    const next = (code) => code;
    done();
    deleteUser(req, resp, next);
  });
});
describe('getUsers', () => {
  /* beforeAll(async () => {
    db = await database();
    const collectionUsers = await db.collection('users');
    await collectionUsers.insertMany([
      {
        email: 'user@test',
        roles: { admin: true },
      },
      {
        email: 'user2@test',
        roles: { admin: false },
      },
      {
        email: 'user3@test',
        roles: { admin: false },
      },
    ]);
  }); */

  // afterAll(async () => {
  //  await (await db()).collection('users').deleteMany({});
  //  await db().close();
  // });

  it('Deberia de poder obtener 2 usuarios', (done) => {
    const req = {
      query: {},
      protocol: 'http',
      path: '/users',
      get: () => 'localhost:8080',
    };
    const resp = {
      send: (response) => {
        // console.log('Soy response...', response);
        expect(response.length).toBe(2);
        expect(response[0].email).toBe('test1@test.com');
        done();
      },
      set: (nameHeader, header) => {
        expect(nameHeader).toBe('link');
        expect(header).toBe('<http://localhost:8080/users?limit=10&page=1>; rel="first", <http://localhost:8080/users?limit=10&page=0>; rel="prev", <http://localhost:8080/users?limit=10&page=2>; rel="next", <http://localhost:8080/users?limit=10&page=1>; rel="last"');
        done();
      },
    };
    getUsers(req, resp);
  });
});
