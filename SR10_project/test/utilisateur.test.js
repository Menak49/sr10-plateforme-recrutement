const DB = require('../model/db.js');
const model = require('../model/utilisateur.js');

describe('Tests sur la table Utilisateur', () => {
    
  //variable qui stocke l'email de l'utilisateur créé (create test), puis permet de le supprimer (delete test)
  let createdUserEmail = null;

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
    /* On teste les deux embranchements de la fonction create
    - si le numéros (qui est notre clé unique) existe déjà, on retourne false
    - sinon on crée l'utilisateur*/
  
    //attention à bien vérifer que l'utilisateur n'existe pas déjà dans la BD, sinon erreur!!
    const newUser = {
      phone: 1005089,
      lastName: 'asupp',
      firstName: 'asupp',
      status: 'Active',
      password: 'psu23',
      email: 'supp@supp.fr'
    };

    const existingUser = {
      phone: 1005, //même numéros qu'utilisateur existant (Nina)
      lastName: 'Robert',
      firstName: 'Macha',
      status: 'Active',
      password: 'mdp123',
      email: 'macha.robert@mail.com'
    };

    //test sur le if
    const userCreated = await model.create(newUser.phone, newUser.lastName, newUser.firstName, newUser.status, newUser.password, newUser.email);
    expect(userCreated.affectedRows).toBe(1);

    //test sur le else
    const userNotCreated = await model.create(existingUser.phone, existingUser.lastName, existingUser.firstName, existingUser.status, existingUser.password, existingUser.email);
    expect(userNotCreated).toBe(false);

    createdUserEmail = newUser.email;
  });

  test('read user', async () => {
    const user = await model.read('nina.robert@mail.com');
    expect(user[0].FirstName).toBe('Nina');
  });

  test('readall users', async () => {
    const users = await model.readall();
    expect(users.length).toBeGreaterThan(1);
  });

  test('areValid user', async () => {
    const isValid = await model.areValid('nina.robert@mail.com', 'mdp123');
    expect(isValid).toBe(true);
  });

  test('delete user', async () => {
    const result = await model.deleteUser(createdUserEmail);
    expect(result.affectedRows).toBe(1); //objet renvoyé a un champ affectedRows qui indique le nombre de lignes affectées par la requête
  }); 

/*   test("update user last name", async () => {
    const result = await model.update('LastName', 'nouveauNom', createdUserEmail);
    expect(result.affectedRows).toBe(1);

}); */


});
