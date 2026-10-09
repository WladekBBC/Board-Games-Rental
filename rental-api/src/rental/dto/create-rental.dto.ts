import { Type } from "class-transformer";
import { IsDateString, IsInt, IsString, ValidateNested } from "class-validator";

class GameReferenceDto {
  @IsInt()
  id!: number;
}

export class CreateRentalDto {
  @IsString()
  index!: string;

  @IsDateString()
  rentedAt!: Date;

  @ValidateNested()
  @Type(() => GameReferenceDto)
  game!: GameReferenceDto;
}
