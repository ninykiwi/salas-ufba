import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Seed default SUPERADMIN if none exists
    const superadminCount = await this.prisma.user.count({
      where: { role: Role.SUPERADMIN },
    });
    if (superadminCount === 0) {
      const hashedPassword = await bcrypt.hash('SuperAdminPassword123', 10);
      await this.prisma.user.create({
        data: {
          name: 'Super Administrador',
          email: 'superadmin@ufba.br',
          password: hashedPassword,
          role: Role.SUPERADMIN,
        },
      });
      console.log('Default SUPERADMIN seeded: superadmin@ufba.br / SuperAdminPassword123');
    }
  }

  async create(data: {
    name: string;
    email: string;
    siape?: string;
    password: string;
    role: Role;
    instituteIds?: string[];
  }): Promise<Omit<User, 'password'>> {
    // Check if email already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new ConflictException('E-mail já cadastrado');
    }

    // Check if siape already exists if provided
    if (data.siape) {
      const existingSiape = await this.prisma.user.findUnique({
        where: { siape: data.siape },
      });
      if (existingSiape) {
        throw new ConflictException('SIAPE já cadastrado');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with optional institute associations
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        siape: data.siape || null,
        password: hashedPassword,
        role: data.role,
        institutes: {
          connect: data.instituteIds?.map(id => ({ id })) || [],
        },
      },
      include: {
        institutes: true,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { institutes: true },
    });
  }

  async findBySiape(siape: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { siape },
      include: { institutes: true },
    });
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { institutes: true },
    });
    if (!user) return null;

    const { password, ...result } = user;
    return result;
  }

  async findByEmailOrSiape(identifier: string): Promise<User | null> {
    // Try email first
    let user = await this.findByEmail(identifier);
    if (user) return user;

    // Try siape
    user = await this.findBySiape(identifier);
    return user;
  }
}
