import { BadRequestError } from "@/core/error";
import { Request, Response, NextFunction } from "express";
import { AuthId } from "../interfaces";
import { Roles } from "@/Api/Users/model/roles/role";
import { User } from "@/Api/Users/model/users";

type RoleType = string;
export class RoleGuard {
  static allow(...allowedRoles: RoleType[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.userId;

        if (!userId) {
          throw new BadRequestError("Unauthorized");
        }

        const user = await User.findById(userId);
        if (!user) {
          throw new BadRequestError("User not found");
        }

        const role = await Roles.findById(user.role);
        if (!role) {
          throw new BadRequestError("Role not found");
        }
        if (!allowedRoles.includes(role.name)) {
          throw new BadRequestError("Forbidden");
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
