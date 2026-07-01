import { Controller, Get, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Request() req) {
    const requester = req.user;

    // 1. PROFESSOR cannot list users
    if (requester.role === Role.PROFESSOR) {
      throw new ForbiddenException('Professores não têm permissão para listar usuários');
    }

    return this.usersService.findAllForUser(requester);
  }
}
