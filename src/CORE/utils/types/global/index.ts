export const API_SUFFIX = "/api/v1";
export const day = new Date().toISOString();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// src/types/express-session.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      _id?: string;
      otpCode: string;
      username?: string;
      firstName?: string;
      middleName?: string;
      surName?: string;
      role?: string;
      country?: string;
      stateOfOrigin?: string;
      phoneNumber?: string;
      address?: string;
      email?: string;
      password?: string;
      keyholder?: string;
      changepassword?: boolean;
    };
  }
}



// declare module "@/Api/Users/model/users" {
//   interface UserModel {
//     subscription?: PopulatedDoc<SubscriptionModel>;
//   }
// }
