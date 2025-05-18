import request from "supertest";
import app from "../src/index";

describe("API Endpoints", () => {
  test("GET /api/health", async () => {
    const response = await request(app).get("/api/health");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("OK");
  });
});
