const DB = require('../model/db.js');
const model = require('../model/utilisateur.js');

describe('Tests sur la table Utilisateur', () => {
    
    beforeAll(async () => {
    // Instructions à exécuter avant le lancement des tests
  });

  afterAll(async () => {
    // Instructions à exécuter après tous les tests
    // Ferme toutes les connexions dans le pool
    await new Promise((resolve, reject) => {
        DB.end((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
  });

  test('create user', async () => {
    const newUser = {
      phone: 123456789,
      lastName: 'Doe',
      firstName: 'John',
      status: 'Active',
      password: 'password123',
      email: 'test@test.fr'
    };
    const userId = await model.create(newUser.phone, newUser.lastName, newUser.firstName, newUser.status, newUser.password, newUser.email);
    expect(userId).toBeGreaterThan(0);

    const user = await model.read(newUser.email);
    expect(user.Phone).toBe(newUser.phone);
    expect(user.LastName).toBe(newUser.lastName);
    expect(user.FirstName).toBe(newUser.firstName);
    expect(user.Status).toBe(newUser.status);
    expect(user.Password).toBe(newUser.password);
    expect(user.Email).toBe(newUser.email);
  });

  test('read user', async () => {
    const user = await model.read('test@test.fr');
    expect(user.FirstName).toBe('John');
  });

  test('readall users', async () => {
    const users = await model.readall();
    expect(users.length).toBeGreaterThanOrEqual(1);
  });

  test('areValid user', async () => {
    const isValid = await model.areValid('test@test.fr', 'password123');
    expect(isValid).toBe(true);
  });

  test('update user', async () => {
    const updatedData = {
      phone: 987654321,
      lastName: 'Smith',
      firstName: 'Jane',
      status: 'Inactive',
      password: 'newpassword123'
    };
    await model.update(updatedData, 'test@test.fr');

    const user = await model.read('test@test.fr');
    expect(user.Phone).toBe(updatedData.phone);
    expect(user.LastName).toBe(updatedData.lastName);
    expect(user.FirstName).toBe(updatedData.firstName);
    expect(user.Status).toBe(updatedData.status);
    expect(user.Password).toBe(updatedData.password);
  });

  test('delete user', async () => {
    await model.deleteUser('test@test.fr');

    const user = await model.read('test@test.fr');
    expect(user).toBeUndefined();
  });
});
