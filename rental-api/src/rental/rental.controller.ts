import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Permission } from 'src/decorators/permissions.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Perms } from 'src/enums/permissions.enum';

@UseGuards(AuthGuard)
@Permission([Perms.A, Perms.R])
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post('/add')
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.create(createRentalDto);
  }

  @Get("/rentals")
  findAll() {
    return this.rentalService.findAll();
  }

  @Get('/rental/:id')
  findOne(@Param('id') id: number) {
    return this.rentalService.findOne(id);
  }

  @Patch('/return/:id')
  update(@Param('id') id: number) {
    return this.rentalService.return(id);
  }
}
