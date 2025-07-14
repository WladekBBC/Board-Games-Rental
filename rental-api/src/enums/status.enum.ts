import { BadRequestException } from "@nestjs/common"

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

export const checkStatus = (status: Status)=>{
    switch(status){
        case(Status.A):
            throw new BadRequestException("Order already accepted");
        case(Status.C):
            throw new BadRequestException("Order already canceled");
        case(Status.E):
            throw new BadRequestException("Order already expired");
        default:
            return
    }
}