// Example using Jest
import { DatabaseService } from "@services/database.service";

describe("Database Service", () => {
  let dbService: DatabaseService;

  beforeAll(() => {
    dbService = new DatabaseService();
  });

  test("should connect to database", async () => {
    const result = await dbService.query("SELECT NOW()");
    expect(result.rows[0].now).toBeInstanceOf(Date);
  });
});
