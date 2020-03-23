const database = require('../../connection/connect_db');

const {
  createUser,
  getUserId,
  getUsers,
  updateUserId,
  deleteUserId,
} = require('../users');

describe('createUsers', () => {
  beforeAll(async () => {
    await database();
  });

  afterAll(async () => {
    const collectionUsers = (await database()).collection('users');
    await collectionUsers.deleteMany({});
    await database().close();
  });

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
        done();
      },
    };
    /* const next = (code) => code; */
    createUser(req, resp);
  });
  it('should show an error 400 if not send email', (done) => {
    const req = {
      body: {
        email: '',
        password: '123456',
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
        email: 'test1@test',
        password: '123456',
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
        email: 'test1@test.com',
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
  it('should show an error 403 if user exists', (done) => {
    const req = {
      body: {
        email: 'test1@test.com',
        password: '123456',
      },
    };

    const next = (code) => {
      expect(code).toBe(403);
      done();
    };

    createUser(req, {}, next);
  });
});

describe('getUserId', () => {
  beforeAll(async () => {
    await database();
    const collectionUsers = (await database()).collection('users');
    await collectionUsers.insertMany([
      {
        email: 'test1@test.com',
        password: '123456',
        roles: {
          admin: false,
        },
      },
      {
        email: 'admin@admin.com',
        password: '123456',
        roles: {
          admin: true,
        },
      },
    ]);
  });
  afterAll(async () => {
    const collectionUsers = (await database()).collection('users');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 400 if user is not exists', (done) => {
    const req = {
      params: {
        uid: 'user@test.com',
      },
    };

    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    getUserId(req, {}, next);
  });
  it('should get an user', (done) => {
    const req = {
      params: {
        uid: 'test1@test.com',
      },
    };
    const resp = {
      send: (response) => {
        expect(response.email).toBe('test1@test.com');
        expect(response.roles.admin).toBe(false);
        done();
      },
    };
    getUserId(req, resp);
  });
});

describe('updateUserId', () => {
  beforeAll(async () => {
    await database();
    const collectionUsers = (await database()).collection('users');
    await collectionUsers.insertMany([
      {
        email: 'test1@test.com',
        password: '123456',
        roles: {
          admin: false,
        },
      },
      {
        email: 'admin@admin.com',
        password: '123456',
        roles: {
          admin: true,
        },
      },
    ]);
  });
  afterAll(async () => {
    const collectionUsers = (await database()).collection('users');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 403 if user is not admin', (done) => {
    const req = {
      params: {
        uid: 'test1@test.com',
      },
      headers: {
        user: {
          roles: {
            admin: false,
          },
        },
      },
      body: {
        email: 'test1@test.com',
        password: '123456',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(403);
      done();
    };
    updateUserId(req, {}, next);
  });

  it('should show an error 404 if user not exists', (done) => {
    const req = {
      params: {
        uid: 'user@test.com',
      },
      headers: {
        user: {
          roles: {
            admin: false,
          },
        },
      },
      body: {
        email: 'user@test.com',
        password: '123456',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    updateUserId(req, {}, next);
  });


  it('should show an error 400 if email and password not exists', (done) => {
    const req = {
      params: {
        uid: 'test1@test.com',
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
    updateUserId(req, {}, next);
  });

  it('should update an user', (done) => {
    const req = {
      params: {
        uid: 'test1@test.com',
      },
      headers: {
        user: {
          roles: {
            admin: true,
          },
        },
      },
      body: {
        email: 'test1@test.com',
        password: '12345',
        roles: {
          admin: false,
        },
      },
    };
    const resp = {
      send: (response) => {
        expect(response.email).toBe('test1@test.com');
        done();
      },
    };
    updateUserId(req, resp);
  });
});


describe('deleteUserId', () => {
  beforeAll(async () => {
    await database();
    const collectionUsers = (await database()).collection('users');
    await collectionUsers.insertMany([
      {
        email: 'test1@test.com',
        password: '123456',
        roles: {
          admin: false,
        },
      },
      {
        email: 'admin@admin.com',
        password: '123456',
        roles: {
          admin: true,
        },
      },
    ]);
  });
  afterAll(async () => {
    const collectionUsers = (await database()).collection('users');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 404 if user not exists', (done) => {
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
        email: 'user@test.com',
        password: '12345',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    deleteUserId(req, {}, next);
  });


  it('should delete an user', (done) => {
    const req = {
      params: {
        uid: 'test1@test.com',
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
        done();
      },
    };
    deleteUserId(req, resp);
  });
});
describe('getUsers', () => {
  beforeAll(async () => {
    await database();
    const collectionUsers = (await database()).collection('users');
    await collectionUsers.insertMany([
      {
        email: 'test1@test.com',
        password: '123456',
        roles: {
          admin: false,
        },
      },
      {
        email: 'admin@admin.com',
        password: '123456',
        roles: {
          admin: true,
        },
      },
    ]);
  });
  afterAll(async () => {
    const collectionUsers = (await database()).collection('users');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('Deberia de poder obtener 2 usuarios', (done) => {
    const req = {
      query: {},
      protocol: 'http',
      path: '/users',
      get: () => 'localhost:8080',
    };
    const resp = {
      send: (response) => {
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
