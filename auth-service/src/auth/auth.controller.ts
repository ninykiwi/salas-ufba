import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException, ForbiddenException, HttpCode, HttpStatus } from '@nestjs/common';
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
    
    // Default to PROFESSOR if no role is provided
    const targetRole = body.role || Role.PROFESSOR;

    // 1. PROFESSOR cannot register anyone
    if (requester.role === Role.PROFESSOR) {
      throw new ForbiddenException('Professores não têm permissão para cadastrar usuários');
    }

    // 2. ADMIN can only register PROFESSOR
    if (requester.role === Role.ADMIN && targetRole !== Role.PROFESSOR) {
      throw new ForbiddenException('Administradores só podem cadastrar professores');
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
