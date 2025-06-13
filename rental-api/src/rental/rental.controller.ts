import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Sse } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Permission } from 'src/decorators/permissions.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Perms } from 'src/enums/permissions.enum';
import { from, map, Observable } from 'rxjs';
import { Rental } from './entities/rental.entity';

@UseGuards(AuthGuard)
@Permission([Perms.A, Perms.R])
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post('/add')
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.create(createRentalDto);
  }

  @Sse('/stream-rentals')
  subscribeGames(): Observable<{data: Rental[]}> {
    return from(this.rentalService.findAll()).pipe(map((games)=>({ data: games })))
  }

  @Get('/rentals')
  findAll() {
    return this.rentalService.findAll();
  }

  @Get('/rental/:id')
  findOne(@Param('id') id: number) {
    return this.rentalService.findOne(id);
  }

  @Get('/history/:id')
  findHistory(@Param('id') gameId: number) {
    return this.rentalService.findByGame(gameId);
  }

  @Patch('/return/:id')
  update(@Param('id') id: number) {
    return this.rentalService.return(id);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: number) {
    return this.rentalService.remove(id);
  }
}
