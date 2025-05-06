import { Perms } from "./perms"

export interface IUser {
    id: number,
    email: string,
    password: string
    permissions: Perms
}