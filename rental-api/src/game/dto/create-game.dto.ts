export class CreateGameDto {
    id:number;
    title: string;
    desc: string;
    category: string;
    amount: number;
    quantity?: number;
}