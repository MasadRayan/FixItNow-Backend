export interface ICreateCategory {
    name : string;
    description ?: string;
    iconUrl : string;
}

export interface IUserFilters {
  role?: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  status?: "ACTIVE" | "BANNED";
  search?: string;
  page?: number;
  limit?: number;
}