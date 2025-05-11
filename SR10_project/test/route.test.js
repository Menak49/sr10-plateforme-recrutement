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
