import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailOrSiape(identifier);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
      role: user.role,
      institutes:
        user.institutes?.map((i) => ({
          id: i.id,
          name: i.name,
          slug: i.slug,
        })) || [],
    };

    await this.auditService.log({
      admin_id: user.id,
      admin_name: user.name,
      admin_role: user.role,
      action: 'LOGIN',
      resource_type: 'sistema',
      description: 'Login realizado',
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        siape: user.siape,
        role: user.role,
        institutes: user.institutes || [],
      },
    };
  }

  async register(
    data: {
      name: string;
      email: string;
      siape?: string;
      password: string;
      role: Role;
      instituteIds?: string[];
    },
    actor: { id: string; name: string; role: string },
  ) {
    return this.usersService.create(data, actor);
  }
}
