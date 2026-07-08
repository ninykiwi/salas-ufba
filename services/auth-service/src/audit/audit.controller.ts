import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get('logs')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Request() req,
    @Query('admin_id') admin_id?: string,
    @Query('resource_type') resource_type?: string,
  ) {
    if (req.user.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(
        'Apenas superadministradores podem visualizar os logs',
      );
    }
    return this.auditService.findAll({ admin_id, resource_type });
  }
}
