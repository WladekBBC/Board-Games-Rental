export class CreateGameDto {
    id:number;
    title: string;
    description: string;
    category: string;
    amount: number;
    quantity?: number;
    ages?: string;
    time?: string;
    players?: string;
}