
// import { pool } from "@config/db";

// export class DatabaseService {
//   async query(text: string, params?: any[]) {
//     const client = await pool.connect();
//     try {
//       return await client.query(text, params);
//     } finally {
//       client.release();
//     }
//   }

//   async getUsers() {
//     const { rows } = await this.query("SELECT * FROM users");
//     return rows;
//   }
// }
