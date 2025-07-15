import { Router } from "express";
import { healthcheck } from "../App_module/Health_check/index";

export const AppRouter = Router()



AppRouter.get("/health", healthcheck);