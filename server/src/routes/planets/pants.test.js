const request = require("supertest");
const app = require("../../app");

describe("Test GET /planets", () => {
  test("It should respond with 200 success", async () => {
    await request(app)
      .get("/v1/planets")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
