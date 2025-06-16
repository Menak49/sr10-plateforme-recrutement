const request = require("supertest");
const app = require("../app");

let agent;

beforeAll(async () => {
  agent = request.agent(app);
  await agent
    .post("/LogIn")
    .send({
      Email: "paul@mail.com", // un compte candidat
      password: "pwd"
    })
    .expect(302);
});

describe("Contrôle d'accès admin", () => {
  test("Un candidat connecté ne peut pas accéder à /admin/Accueil", async () => {
    const response = await agent.get("/admin/Accueil");
    expect(response.statusCode).toBe(403);
  });

  test("Un candidat connecté ne peut pas accéder à /recruteur/Accueil", async () => {
    const response = await agent.get("/recruteur/Accueil");
    expect(response.statusCode).toBe(403);
  });

    test("GET /candidat/devenirRecruteur devrait répondre 200", async () => {
    const response = await agent.get("/candidat/devenirRecruteur");
    expect(response.statusCode).toBe(200);
  });

  test("GET /candidat/creerOrganisation devrait répondre 200", async () => {
    const response = await agent.get("/candidat/creerOrganisation");
    expect(response.statusCode).toBe(200);
  });
  test("GET candidat/devenirAdmin devrait répondre 200", async () => {
    const response = await agent.get("/candidat/devenirAdmin");
    expect(response.statusCode).toBe(200);
  });
});



  test("GET /candidat/Accueil sans session doit être interdit", async () => {
  const response = await request(app).get("/candidat/Accueil");
  expect([401, 302, 403]).toContain(response.statusCode);
});
