export enum Perms{
    A = "Admin",
    R = "RWSS", 
    U = "User"
}

export const toPerms = (perm: string): Perms =>{
    if(perm === "Admin")
      return Perms.A
    else if(perm === "RWSS")
      return Perms.R
    else
      return Perms.U
}