import { Controller, Get, Query } from '@nestjs/common';
import { DealersService } from './dealers.service';

@Controller('dealers')
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  @Get()
  findAll(@Query('city') city?: string) {
    return this.dealersService.findAll(city);
  }
}
