import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface ICreateCategory {
    name : string;
    description ?: string;
    iconUrl : string;
}

export interface IUserFilters {
  role?: Role
  status?: UserStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IUpdateUserStatus {
    status : UserStatus;
}