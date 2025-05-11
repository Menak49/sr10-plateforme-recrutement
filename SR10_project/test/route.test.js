const request = require("supertest");
const app = require("../app");

describe("Test de la route /candidat/Accueil", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/candidat/Accueil");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test de la route /candidat/parcourir", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/candidat/parcourir");
    expect(response.statusCode).toBe(200);
  });

  test("Elle devrait renvoyer une page avec des offres", async () => {
    const response = await request(app).get("/candidat/parcourir?search=dev&page=1");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("offre");  
  });
});

describe("Test de la route /candidat/candidatures", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/candidat/candidatures");
    expect(response.statusCode).toBe(200);
  });

  test("Elle devrait renvoyer une page avec des candidatures", async () => {
    const response = await request(app).get("/candidat/candidatures?page=1&search=developer");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("candidature");  
  });
});

describe("Test de la route /candidat/privileges", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/candidat/privileges");
    expect(response.statusCode).toBe(200);
  });


});

describe("Test de la route /candidat/devenirRecruteur", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/candidat/devenirRecruteur");
    expect(response.statusCode).toBe(200);
  });

  test("Elle devrait afficher les organisations disponibles", async () => {
    const response = await request(app).get("/candidat/devenirRecruteur");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("organisation");
  });
});

describe("Test de la route /candidat/creerOrganisation", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/candidat/creerOrganisation");
    expect(response.statusCode).toBe(200);
  });

  test("Elle devrait afficher le formulaire de création d'organisation", async () => {
    const response = await request(app).get("/candidat/creerOrganisation");
    expect(response.statusCode).toBe(200);
  });
});




describe("Test de la route /recruteur/modifierOffre/:id", () => {
  test("Elle devrait répondre au GET avec 200 pour un ID valide", async () => {
    const response = await request(app).get("/recruteur/modifierOffre/1");
    expect(response.statusCode).toBe(200);
  });

  test("Elle devrait afficher les informations de l'offre à modifier", async () => {
    const response = await request(app).get("/recruteur/modifierOffre/1");
    expect(response.text).toContain("Choisissez une fiche de poste");
  });
});

describe("Test de la route /recruteur/ajouterFicheDePoste", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/recruteur/ajouterFicheDePoste");
    expect(response.statusCode).toBe(200);
  });

  test("Elle devrait afficher le formulaire de publication d'une fiche de poste", async () => {
    const response = await request(app).get("/recruteur/ajouterFicheDePoste");
    expect(response.text).toContain("CRÉER UNE NOUVELLE FICHE DE POSTE");
  });
});

describe("Test de la route /recruteur/modifierFicheDePoste/:id", () => {
  test("Elle devrait répondre au GET avec 200 pour un ID valide", async () => {
    const response = await request(app).get("/recruteur/modifierFicheDePoste/1");
    expect(response.statusCode).toBe(200);
  });

  test("Elle devrait afficher la fiche de poste à modifier", async () => {
    const response = await request(app).get("/recruteur/modifierFicheDePoste/1");
    expect(response.text).toContain("<select class=\"form-select form-select-sm\" id=\"statutPoste\" name=\"statutPoste\" required>");
  });
});

describe("Test de la route /recruteur/gererFicheDePoste", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/recruteur/gererFicheDePoste");
    expect(response.statusCode).toBe(200);
  });

  test("Elle devrait afficher les fiches de poste existantes", async () => {
    const response = await request(app).get("/recruteur/gererFicheDePoste");
    expect(response.text).toContain("Fiches de Poste");
  });
});

describe("Test de la route /recruteur/GererOffres", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/recruteur/GererOffres");
    expect(response.statusCode).toBe(200);
  });

  test("Elle devrait afficher les offres existantes", async () => {
    const response = await request(app).get("/recruteur/GererOffres");
    expect(response.text).toContain("GererOffres");
  });
});

describe("Test de la route /recruteur/privileges", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/recruteur/privileges");
    expect(response.statusCode).toBe(200);
  });

  test("Elle devrait afficher les privilèges", async () => {
    const response = await request(app).get("/recruteur/privileges");
    expect(response.text).toContain("Privilèges");
  });
});



describe("Test de la route /admin/Accueil", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/admin/Accueil");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test de la route /admin/devenirRecruteur", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/admin/devenirRecruteur");
    expect(response.statusCode).toBe(200);
  });

});

describe("Test de la route /admin/privileges", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/admin/privileges");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test de la route /admin/creerOrganisation", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/admin/creerOrganisation");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test de la route /admin/gestionUtilisateurs", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/admin/gestionUtilisateurs");
    expect(response.statusCode).toBe(200);
  });

});

describe("Test de la route /admin/GestionDemandeRecruteur", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/admin/GestionDemandeRecruteur");
    expect(response.statusCode).toBe(200);
  });

});

describe("Test de la route /admin/organisations", () => {
  test("Elle devrait répondre au GET avec 200", async () => {
    const response = await request(app).get("/admin/organisations");
    expect(response.statusCode).toBe(200);
  });
});