
export enum Status{
    W = "Waiting",
    A = "Accepted",
    C = "Canceled",
    E = "Expired"
}

export const convertStatus = (status: string): Status => {
    switch(status){
        case "Expired": 
            return Status.E
        case "Accepted":
            return Status.A
        case "Canceled":
            return Status.C
        default:
            return Status.W
    }
}