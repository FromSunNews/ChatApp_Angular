import { Role } from "./role";

export class User {
  id!: string;
  email!: string;
  isActiveEmail!: boolean;
  username!: string;
  password!: string;
  createdAt!: string;
  updatedAt!: string | null;
  rememberAccount!: boolean;
  token!: string;
  appOriginUrl!: string;
  roleId!: number;
  role!: Role;
  
}