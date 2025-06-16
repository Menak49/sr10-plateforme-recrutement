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

const newUser = {
      phone: 1005089,
      lastName: 'asupp',
      firstName: 'asupp',
      status: 'Active',
      password: 'psu23',
      email: 'supp@supp.fr'
    };

  test('create user success', async () => {
    /* On teste les deux embranchements de la fonction create
    - si le numéros (qui est notre clé unique) existe déjà, on retourne false
    - sinon on crée l'utilisateur*/
  
    //attention à bien vérifer que l'utilisateur n'existe pas déjà dans la BD, sinon erreur!!
    

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

  test('create user failure', async () => {
    const querySpy = jest.spyOn(DB, 'query').mockRejectedValue(new Error('Database error'));

    try {
      await model.create('1234567890', 'Doe', 'John', 'Active', 'password', 'test@example.com');
    } catch (error) {
      expect(error.message).toBe('Database error');
    }

    querySpy.mockRestore();
  });

  test('read user success', async () => {
    const user = await model.read('nina.robert@mail.com');
    expect(user[0].FirstName).toBe('Nina');
  });

  test('read user failure ', async () => {
    const querySpy = jest.spyOn(DB, 'query').mockRejectedValue(new Error('Database error'));

    try {
      await model.read('test@example.com');
    } catch (error) {
      expect(error.message).toBe('Database error');
    }

    querySpy.mockRestore();  // Restaure la méthode après le test
  });

  test('readall users success', async () => {
    const users = await model.readall();
    expect(users.length).toBeGreaterThan(1);
  });

  test('readall user failure', async () => {
    const querySpy = jest.spyOn(DB, 'query').mockRejectedValue(new Error('Database error'));

    try {
      await model.readall();
    } catch (error) {
      expect(error.message).toBe('Database error');
    }

    querySpy.mockRestore();
  });


  test('areValid user success', async () => {
    const isValid = await model.areValid('nina.robert@mail.com', 'mdp123');
    expect(isValid).toBe(true);
  });

  test('areValid returns false when email is valid but password is incorrect', async () => {
    const email = 'macha.robert@mail.com';
    const incorrectPassword = 'wrongpassword'; // Le mot de passe incorrect
  
    const result = await model.areValid(email, incorrectPassword);
    
    expect(result).toBe(false);
  });

  
  test('areValid user failure ', async () => {
    const querySpy = jest.spyOn(DB, 'query').mockRejectedValue(new Error('Database error'));

    try {
      await model.areValid('nimportequoi', 'password');
    } catch (error) {
      expect(error.message).toBe('Database error');
    }

    querySpy.mockRestore();
  });
  

  test('read filtre pagine user success', async () => {
    const result = await model.readAllFiltréPaginé('Robert', 10, 0);
  
    expect(result.length).toBeGreaterThan(0);
  
    const found = result.find(u => u.LastName === 'Robert');
    expect(found).toBeDefined();
  });

  test('read filtre pagine user failure', async () => {
    const querySpy = jest.spyOn(DB, 'query').mockRejectedValue(new Error('Database error'));

    try {
      await model.readAllFiltréPaginé('searchTerm', 10, 0);
    } catch (error) {
      expect(error.message).toBe('Database error');
    }

    querySpy.mockRestore();
  });
  
  test('count user success', async () => {
    const result = await model.count('Robert'); 
    expect(result).toBeGreaterThan(0); 
  }); 

  test('count users failure', async () => {
    const querySpy = jest.spyOn(DB, 'query').mockRejectedValue(new Error('Database error'));

    try {
      await model.count('Durand');
    } catch (error) {
      expect(error.message).toBe('Database error');
    }

    querySpy.mockRestore();
  });

  test('delete user success', async () => {
    const result = await model.deleteUser(newUser.phone);
    expect(result.affectedRows).toBe(1); //objet renvoyé a un champ affectedRows qui indique le nombre de lignes affectées par la requête
  }); 

  test('deleteUser user failure', async () => {
    const querySpy = jest.spyOn(DB, 'query').mockRejectedValue(new Error('Database error'));

    try {
      await model.deleteUser('test@example.com');
    } catch (error) {
      expect(error.message).toBe('Database error');
    }

    querySpy.mockRestore();
  });
  

/*   test("update user last name", async () => {
    const result = await model.update('LastName', 'nouveauNom', createdUserEmail);
    expect(result.affectedRows).toBe(1);

}); */


});
