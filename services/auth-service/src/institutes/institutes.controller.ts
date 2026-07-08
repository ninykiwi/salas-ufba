import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { CreateInstituteDto } from './dto/create-institute.dto';

@Controller('institutes')
@UseGuards(JwtAuthGuard)
export class InstitutesController {
  constructor(private institutesService: InstitutesService) {}

  @Post()
  async create(@Request() req, @Body() body: CreateInstituteDto) {
    // Only SUPERADMIN can create institutes
    if (req.user.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(
        'Apenas superadministradores podem cadastrar institutos',
      );
    }
    return this.institutesService.create(body);
  }

  @Get()
  async findAll() {
    return this.institutesService.findAll();
  }
}
