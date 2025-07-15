import { prismaClient } from "@/APP";
import { Request, Response } from "express";
import { BadRequestError } from "@/CORE/utils/errors";
import { UserInterface } from "../../interface";
import {hashSync} from 'bcrypt'

export const signup = async (req: Request<{},{},UserInterface>, res: Response) => {
  const { email, firstName, middleName, lastName,role, phoneNumber } = req.body;

    const user = await prismaClient.user.findFirst({ where: { or: [email, phoneNumber] } });
    if (user) { 
        throw new BadRequestError('user Exist',  401)
    }
    const createUser = await prismaClient.user.create({
        data: {
            email,
            firstName,
            middleName,
            lastName,
            phoneNumber,
            role,
            password: hashSync(req.body.password,15)
        },
    })
};
