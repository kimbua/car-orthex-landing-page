import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { CompareService } from './compare.service';

@Controller('compare')
export class CompareController {
  constructor(private readonly compareService: CompareService) {}

  @Get()
  async compare(@Query('ids') ids?: string) {
    const slugs = (ids || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (slugs.length === 0) {
      throw new BadRequestException('Provide at least 1 car id/slug to compare');
    }
    if (slugs.length > 3) {
      throw new BadRequestException('Compare supports a maximum of 3 cars');
    }
    if (new Set(slugs).size !== slugs.length) {
      throw new BadRequestException('Duplicate cars in compare list');
    }

    return this.compareService.buildComparison(slugs);
  }
}
