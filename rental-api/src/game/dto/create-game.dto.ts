import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from "class-validator";

export class CreateGameDto {
  @IsString()
  title!: string;

  @IsString()
  @MaxLength(500)
  description!: string;

  @IsString()
  category!: string;

  @IsUrl()
  imageUrl!: string;

  @IsInt()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  ages?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  players?: string;
}
