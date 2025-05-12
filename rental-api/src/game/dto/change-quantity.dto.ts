import { IsNumber, Min } from 'class-validator';

export class ChangeQuantity {
    @IsNumber()
    id: number;

    @IsNumber()
    @Min(0)
    quantity: number;
}
