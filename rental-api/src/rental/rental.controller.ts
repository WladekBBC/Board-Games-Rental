import { Controller, Get, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RentalService } from './rental.service';
import { Permission } from 'src/decorators/permissions.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Perms } from 'src/enums/permissions.enum';

@UseGuards(AuthGuard)
@Permission([Perms.A, Perms.R])
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}
  
  @Get('/')
  findAll() {
    return this.rentalService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.rentalService.findOne(id);
  }

  @Get('/history/:id')
  findHistory(@Param('id') gameId: number) {
    return this.rentalService.findByGame(gameId);
  }
}
