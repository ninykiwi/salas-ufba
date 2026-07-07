import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException, ForbiddenException, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(
    @Request() req,
    @Body()
    body: {
      name: string;
      email: string;
      siape?: string;
      password: string;
      role?: Role;
      instituteIds?: string[];
    },
  ) {
    const requester = req.user;
    
    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.\-_])[A-Za-z\d@$!%*?&#.\-_]{8,}$/;
    if (!body.password || !passwordRegex.test(body.password)) {
      throw new BadRequestException(
        'A senha não atende aos requisitos de complexidade: mínimo de 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
      );
    }

    // Default to PROFESSOR if no role is provided
    const targetRole = body.role || Role.PROFESSOR;

    // 1. PROFESSOR cannot register anyone
    if (requester.role === Role.PROFESSOR) {
      throw new ForbiddenException('Professores não têm permissão para cadastrar usuários');
    }

    // 2. ADMIN restrictions
    if (requester.role === Role.ADMIN) {
      if (targetRole !== Role.PROFESSOR) {
        throw new ForbiddenException('Administradores só podem cadastrar professores');
      }

      // Check and enforce institute matching for ADMIN
      if (body.instituteIds && body.instituteIds.length > 0) {
        const adminInstituteIds = requester.institutes?.map(inst => inst.id) || [];
        const hasInvalidAssociation = body.instituteIds.some(
          id => !adminInstituteIds.includes(id),
        );

        if (hasInvalidAssociation) {
          throw new ForbiddenException(
            'Administradores só podem cadastrar professores associados aos seus próprios institutos',
          );
        }
      } else {
        // Automatically link professor to the admin's institutes if none specified
        body.instituteIds = requester.institutes?.map(inst => inst.id) || [];
      }
    }

    // 3. SUPERADMIN can register anyone
    return this.authService.register({
      ...body,
      role: targetRole,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body()
    body: {
      email: string; // This can be email or SIAPE
      password: string;
    },
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }
}
