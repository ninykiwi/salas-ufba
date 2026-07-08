import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { CreateInstituteDto } from './dto/create-institute.dto';

@Controller('institutes')
export class InstitutesController {
  constructor(private institutesService: InstitutesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('id') id: string) {
    // Only SUPERADMIN can delete institutes
    if (req.user.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(
        'Apenas superadministradores podem excluir institutos',
      );
    }
    await this.institutesService.remove(id);
  }
}
