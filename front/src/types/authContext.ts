import { Perms } from "@/interfaces/perms";
import { IUser } from "@/interfaces/user";

export type AuthContextType = {
    user: LoggedUserType | null;
    JWT: string | null;
    permissions: Perms;
    loading: boolean;
    error: string | null;
    register: (data: LoginDataType) => Promise<void>;
    signIn: (data: LoginDataType) => Promise<void>;
    signOut: () => Promise<void>;
}

export type LoggedUserType = Pick<IUser, "id" | "email">

export type LoginDataType = Pick<IUser, "email" | "password">

/* context users in contexts(catalog) 
-requests
-types
-interfaces*/