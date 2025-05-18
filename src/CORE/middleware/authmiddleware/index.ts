import { Request, Response, NextFunction } from "express";
import CryptoService from "@/CORE/services/encryption";
import { BadRequestError } from "@error/";
// import { User } from "@/Api/Users/model/users";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new BadRequestError("Not Autorized", 401);
  }

  const token = header.substring(7);
  try {
    const userId = CryptoService.decryptId(token);
    // const userExist = await User.findById(userId);

    // if (!userExist) {
    //   throw new BadRequestError("User not found", 404);
    // }

    // req.userId = userExist._id!.toString();
    next();
  } catch (err) {
    next(err)
  }
}
