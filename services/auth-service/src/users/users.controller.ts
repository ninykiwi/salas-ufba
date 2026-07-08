import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Request() req) {
    const requester = req.user;

    // 1. PROFESSOR não tem permissão para listar usuários
    if (requester.role === Role.PROFESSOR) {
      throw new ForbiddenException(
        'Professores não têm permissão para listar usuários',
      );
    }

    return this.usersService.findAllForUser(requester);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Request() req,
  ) {
    const requester = req.user;

    // 1. PROFESSOR não tem permissão para editar
    if (requester.role === Role.PROFESSOR) {
      throw new ForbiddenException(
        'Professores não têm permissão para editar usuários',
      );
    }

    // 2. Buscar o usuário alvo
    const targetUser = await this.usersService.findById(id);
    if (!targetUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // 3. Regras para ADMIN
    if (requester.role === Role.ADMIN) {
      // ADMIN só pode editar professores
      if (targetUser.role !== Role.PROFESSOR) {
        throw new ForbiddenException(
          'Administradores só podem editar perfis de professores',
        );
      }

      // O usuário editado precisa pertencer a pelo menos um instituto que o ADMIN gerencia
      const adminInstIds = requester.institutes?.map((inst) => inst.id) || [];
      const userInstIds = targetUser.institutes?.map((inst) => inst.id) || [];
      const hasSharedInstitute = userInstIds.some((id) =>
        adminInstIds.includes(id),
      );
      if (!hasSharedInstitute) {
        throw new ForbiddenException(
          'Você só pode editar usuários pertencentes aos seus institutos',
        );
      }

      // ADMIN não pode mudar a role do usuário editado para outra coisa que não PROFESSOR
      if (body.role && body.role !== Role.PROFESSOR) {
        throw new ForbiddenException(
          'Administradores não têm permissão para alterar cargos para administrador ou superadministrador',
        );
      }

      // ADMIN só pode associar a institutos que ele próprio gerencia
      if (body.instituteIds) {
        const invalidAssociations = body.instituteIds.filter(
          (id) => !adminInstIds.includes(id),
        );
        if (invalidAssociations.length > 0) {
          throw new ForbiddenException(
            'Você só pode associar usuários a institutos que você gerencia',
          );
        }
      }
    }

    return this.usersService.update(id, body, {
      id: requester.id,
      name: requester.name,
      role: requester.role,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    const requester = req.user;

    // 1. PROFESSOR não pode deletar
    if (requester.role === Role.PROFESSOR) {
      throw new ForbiddenException(
        'Professores não têm permissão para excluir usuários',
      );
    }

    // 2. Buscar usuário alvo
    const targetUser = await this.usersService.findById(id);
    if (!targetUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // 3. Impedir que o usuário delete a si mesmo
    if (requester.id === id) {
      throw new ForbiddenException('Você não pode excluir sua própria conta');
    }

    // 4. Regras para ADMIN
    if (requester.role === Role.ADMIN) {
      // ADMIN só pode deletar professores
      if (targetUser.role !== Role.PROFESSOR) {
        throw new ForbiddenException(
          'Administradores só podem excluir perfis de professores',
        );
      }

      // O usuário precisa pertencer a um dos institutos do ADMIN
      const adminInstIds = requester.institutes?.map((inst) => inst.id) || [];
      const userInstIds = targetUser.institutes?.map((inst) => inst.id) || [];
      const hasSharedInstitute = userInstIds.some((id) =>
        adminInstIds.includes(id),
      );
      if (!hasSharedInstitute) {
        throw new ForbiddenException(
          'Você só pode excluir usuários pertencentes aos seus institutos',
        );
      }
    }

    await this.usersService.delete(id, {
      id: requester.id,
      name: requester.name,
      role: requester.role,
    });
  }
}
