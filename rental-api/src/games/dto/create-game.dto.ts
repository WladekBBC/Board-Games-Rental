export class CreateGameDto {
  title: string;
  description: string;
  imageUrl: string;
  isAvailable?: boolean;
  category: string;
  quantity: number;
} 