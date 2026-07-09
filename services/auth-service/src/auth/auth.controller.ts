import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(@Request() req, @Body() body: RegisterDto) {
    const requester = req.user;

    // Default to PROFESSOR if no role is provided
    const targetRole = body.role || Role.PROFESSOR;

    // 1. PROFESSOR cannot register anyone
    if (requester.role === Role.PROFESSOR) {
      throw new ForbiddenException(
        'Professores não têm permissão para cadastrar usuários',
      );
    }

    // 2. ADMIN restrictions
    if (requester.role === Role.ADMIN) {
      if (targetRole !== Role.PROFESSOR) {
        throw new ForbiddenException(
          'Administradores só podem cadastrar professores',
        );
      }

      // Check and enforce institute matching for ADMIN
      if (body.instituteIds && body.instituteIds.length > 0) {
        const adminInstituteIds =
          requester.institutes?.map((inst) => inst.id) || [];
        const hasInvalidAssociation = body.instituteIds.some(
          (id) => !adminInstituteIds.includes(id),
        );

        if (hasInvalidAssociation) {
          throw new ForbiddenException(
            'Administradores só podem cadastrar professores associados aos seus próprios institutos',
          );
        }
      } else {
        // Automatically link professor to the admin's institutes if none specified
        body.instituteIds = requester.institutes?.map((inst) => inst.id) || [];
      }
    }

    // 3. SUPERADMIN can register anyone
    return this.authService.register(
      {
        ...body,
        role: targetRole,
      },
      { id: requester.id, name: requester.name, role: requester.role },
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() body: LoginDto) {
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
