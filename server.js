import express from "express";
import cors from "cors";
import dotenv from dotenv;










//initiate the environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = Path2D.dirname(__filename)
