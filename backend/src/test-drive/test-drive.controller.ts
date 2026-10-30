import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { TestDriveService } from './test-drive.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('test-drive')
export class TestDriveController {
  constructor(private readonly testDriveService: TestDriveService) {}

  @Post()
  async create(@Body() dto: CreateLeadDto) {
    const exists = await this.testDriveService.modelExists(dto.modelSlug);
    if (!exists) {
      throw new BadRequestException(`Unknown model "${dto.modelSlug}"`);
    }
    const lead = await this.testDriveService.createLead(dto);
    return {
      ok: true,
      message: 'Đăng ký lái thử thành công — BMW sẽ liên hệ bạn sớm nhất.',
      lead: { id: lead.id, status: lead.status, createdAt: lead.createdAt },
    };
  }
}
