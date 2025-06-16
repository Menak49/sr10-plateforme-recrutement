const request = require("supertest");
const app = require("../app");

let agent;

beforeAll(async () => {
  agent = request.agent(app);
  await agent
    .post("/LogIn")
    .send({
      Email: "luc.bernard@mail.com",
      password: "mdp123"
    })
    .expect(302);
});

describe("Tests routes protégées (avec session)", () => {
  test("GET /candidat/Accueil devrait répondre 200", async () => {
    const response = await agent.get("/candidat/Accueil");
    expect(response.statusCode).toBe(200);
  });

  test("GET /candidat/candidatures avec session", async () => {
    const response = await agent.get("/candidat/candidatures");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("candidature");
  });

  test("GET /candidat/parcourir devrait répondre 200", async () => {
    const response = await agent.get("/candidat/parcourir");
    expect(response.statusCode).toBe(200);
  });

  test("GET /candidat/parcourir avec recherche devrait contenir 'offre'", async () => {
    const response = await agent.get("/candidat/parcourir?search=dev&page=1");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("offre");
  });

  test("GET /candidat/privileges devrait répondre 200", async () => {
    const response = await agent.get("/candidat/privileges");
    expect(response.statusCode).toBe(200);
  });

  test("GET /candidat/devenirRecruteur devrait répondre 200 et afficher organisations", async () => {
    const response = await agent.get("/candidat/devenirRecruteur");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("organisation");
  });

  test("GET /candidat/creerOrganisation devrait répondre 200", async () => {
    const response = await agent.get("/candidat/creerOrganisation");
    expect(response.statusCode).toBe(200);
  });

  test("GET /recruteur/Accueil devrait répondre 200", async () => {
    const response = await agent.get("/recruteur/Accueil");
    expect(response.statusCode).toBe(200);
  });

  test("GET /recruteur/modifierOffre/1 devrait répondre 200 et contenir fiche", async () => {
    const response = await agent.get("/recruteur/modifierOffre/1");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Choisissez une fiche de poste");
  });

  test("GET /recruteur/ajouterFicheDePoste devrait répondre 200 et afficher formulaire", async () => {
    const response = await agent.get("/recruteur/ajouterFicheDePoste");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("CRÉER UNE NOUVELLE FICHE DE POSTE");
  });

  test("GET /recruteur/modifierFicheDePoste/1 devrait répondre 200 et afficher formulaire", async () => {
    const response = await agent.get("/recruteur/modifierFicheDePoste/1");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<select class="form-select form-select-sm" id="statutPoste" name="statutPoste" required>');
  });

  test("GET /recruteur/gererFicheDePoste devrait répondre 200 et afficher fiches", async () => {
    const response = await agent.get("/recruteur/gererFicheDePoste");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Fiches de Poste");
  });

  test("GET /recruteur/GererOffres devrait répondre 200 et afficher offres", async () => {
    const response = await agent.get("/recruteur/GererOffres");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("GererOffres");
  });

  test("GET /recruteur/privileges devrait répondre 200 et afficher privilèges", async () => {
    const response = await agent.get("/recruteur/privileges");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Privilèges");
  });

  test("GET /admin/Accueil devrait répondre 200", async () => {
    const response = await agent.get("/admin/Accueil");
    expect(response.statusCode).toBe(200);
  });

  test("GET /admin/privileges devrait répondre 200", async () => {
    const response = await agent.get("/admin/privileges");
    expect(response.statusCode).toBe(200);
  });

  test("GET /admin/gestionUtilisateurs devrait répondre 200", async () => {
    const response = await agent.get("/admin/gestionUtilisateurs");
    expect(response.statusCode).toBe(200);
  });

  test("GET /admin/GestionDemandes devrait répondre 200", async () => {
    const response = await agent.get("/admin/GestionDemandes");
    expect(response.statusCode).toBe(200);
  });

  test("GET /admin/organisations devrait répondre 200", async () => {
    const response = await agent.get("/admin/organisations");
    expect(response.statusCode).toBe(200);
  });
});

describe("Tests routes publiques (sans session)", () => {
  test("GET /LogIn devrait répondre 200", async () => {
    const response = await request(app).get("/LogIn");
    expect(response.statusCode).toBe(200);
  });

  test("GET /SignUp devrait répondre 200", async () => {
    const response = await request(app).get("/SignUp");
    expect(response.statusCode).toBe(200);
  });
});
