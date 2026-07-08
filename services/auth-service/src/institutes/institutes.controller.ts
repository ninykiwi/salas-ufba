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
    return this.institutesService.create(body, {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
    });
  }

  @Get()
  async findAll() {
    return this.institutesService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Request() req, @Param('id') id: string) {
    // Only SUPERADMIN can delete institutes
    if (req.user.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(
        'Apenas superadministradores podem excluir institutos',
      );
    }
    return this.institutesService.remove(id, req.headers.authorization, {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
    });
  }
}
