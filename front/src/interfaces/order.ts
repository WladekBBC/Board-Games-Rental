import { IGame } from "./game";
import { Status } from "./statuses";
import { IUser } from "./user";


export interface IOrder{
    id: number;
    status: Status;
    qrIdentifier: string;
    game: IGame;
    user: IUser;
    createdAt: Date;
}