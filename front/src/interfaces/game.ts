export interface IGame {
    id:number;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    amount: number;
    quantity: number;
    ages?: string;
    time?: string;
    players?: string;
}