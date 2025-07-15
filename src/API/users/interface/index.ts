import { Types } from "@prisma/client/runtime/library";

export interface UserInterface {
  id: Int16Array;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
    password: string;
    phoneNumber: string;
  role: Int16Array;
  createdAt: Date;
  updatedAt: Date;
}
