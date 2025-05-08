import { IGame } from "./game";

export interface IRental{
    id: number;
    index: string;
    rentedAt: Date;
    returnedAt: Date;
    game: IGame;
}