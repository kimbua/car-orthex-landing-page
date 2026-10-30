import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll(
    @Query('fuel') fuel?: string,
    @Query('category') category?: string,
    @Query('isM') isM?: string,
    @Query('series') series?: string,
  ) {
    return this.carsService.findAll({
      fuel,
      category,
      isM: isM === 'true' ? true : isM === 'false' ? false : undefined,
      series,
    });
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const car = await this.carsService.findBySlug(slug);
    if (!car) {
      throw new NotFoundException(`Car "${slug}" not found`);
    }
    return car;
  }
}
