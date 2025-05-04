const utilisateurModel = require('./utilisateur.js'); // Assurez-vous que le chemin est correct


/*async function debugAreValid() {
    try {
        const email = 'jean.dupont@email.com';
        const password = 'motdepassehashé';
        const isValid = await utilisateurModel.areValid(email, password);
        if (isValid) {
            console.log('Les informations d\'identification sont valides.');
        } else {
            console.log('Les informations d\'identification ne sont pas valides.');
        }
    } catch (err) {
        console.error('Erreur lors de l\'appel à areValid :', err);
    }
}*/

async function debugCreateUser() {
    try {
        const newUser = {
            phone: 12389,
            lastName: 'àsupp',
            firstName: 'asupp',
            status: 'Active',
            password: 'password123',
            email: 'àsupp@John.fr'
        };
        const user = await utilisateurModel.create(newUser.phone, newUser.lastName, newUser.firstName, newUser.status, newUser.password, newUser.email);
        console.log('Utilisateur créé :', user);
    }
    catch (err) {
        console.error('Erreur lors de l\'appel à create :', err);
    }
}

/*async function debugDeleteUser() {
    try {
        const email = 'Doe@John.fr';
        const result = await utilisateurModel.deleteUser(email);
        if (result) {
            console.log('Utilisateur supprimé avec succès.', result);
        } else {
            console.log('Aucun utilisateur trouvé avec cet email.');
        }
    }
    catch (err) {
        console.error('Erreur lors de l\'appel à delete :', err);
    }
}*/


/* async function debugReadUser() {
    try {
        const email = 'Sophie@gmail.com';
        const user = await utilisateurModel.read(email);
        if (user) {
            console.log('Utilisateurs trouvés :', user);
        } else {
            console.log('Aucun utilisateur trouvé');
        }
    } catch (err) {
        console.error('Erreur lors de l\'appel à read :', err);
    }
} */

// Appel de la fonction de débogage

// debugAreValid();
/* debugReadUser(); */
debugCreateUser();
//debugDeleteUser();