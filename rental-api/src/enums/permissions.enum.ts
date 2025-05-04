export enum Perms{
    A = "Admin",
    R = "RWSS", 
    U = "User"
}

export const convertPerms = (perms: string): Perms =>{
    switch(perms){
      case "Admin":
        return Perms.A
      case "RWSS":
        return Perms.R
      default: 
        return Perms.U
    }
}