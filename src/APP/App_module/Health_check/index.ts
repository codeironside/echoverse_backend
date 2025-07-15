import { Request, Response } from "express";


export const healthcheck = async (req:Request, res:Response) => {
    res.status(202).json({
        status: "ok",
        message: "Health check passed, server up and running",
        timestamp: new Date().toISOString(),
    });
}
