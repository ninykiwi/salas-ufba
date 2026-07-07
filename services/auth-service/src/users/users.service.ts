import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    await this.seed();
  }

  private getSeedPassword(envVar: string, defaultValue: string): string {
    const value = process.env[envVar];
    if (value) {
      return value;
    }
    console.warn(
      `[seed] ${envVar} não definida — usando senha padrão de desenvolvimento.`,
    );
    return defaultValue;
  }

  async seed(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Seed não pode ser executado em ambiente de produção');
    }

    // 1. Seed default Institute if none exists (re-trigger reload)
    let defaultInstitute = await this.prisma.institute.findFirst();
    if (!defaultInstitute) {
      defaultInstitute = await this.prisma.institute.create({
        data: {
          name: 'Instituto de Computação',
          slug: 'instituto-de-computacao',
        },
      });
      console.log('Default Institute seeded: Instituto de Computação');
    }

    // 2. Seed default SUPERADMIN if none exists
    const superadminCount = await this.prisma.user.count({
      where: { role: Role.SUPERADMIN },
    });
    if (superadminCount === 0) {
      const password = this.getSeedPassword(
        'SEED_SUPERADMIN_PASSWORD',
        'SuperAdminPassword123!',
      );
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          name: 'Super Administrador',
          email: 'superadmin@ufba.br',
          password: hashedPassword,
          role: Role.SUPERADMIN,
        },
      });
      console.log('Default SUPERADMIN seeded: superadmin@ufba.br');
    }

    // 3. Seed default ADMIN if none exists
    const adminCount = await this.prisma.user.count({
      where: { role: Role.ADMIN },
    });
    if (adminCount === 0) {
      const password = this.getSeedPassword(
        'SEED_ADMIN_PASSWORD',
        'AdminPassword123!',
      );
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          name: 'Administrador Geral',
          email: 'admin@ufba.br',
          password: hashedPassword,
          role: Role.ADMIN,
          institutes: {
            connect: { id: defaultInstitute.id },
          },
        },
      });
      console.log('Default ADMIN seeded: admin@ufba.br');
    }

    // 4. Seed default PROFESSOR if none exists
    const professorCount = await this.prisma.user.count({
      where: { role: Role.PROFESSOR },
    });
    if (professorCount === 0) {
      const password = this.getSeedPassword(
        'SEED_PROFESSOR_PASSWORD',
        'ProfessorPassword123!',
      );
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          name: 'Professor de Computação',
          email: 'professor@ufba.br',
          siape: '1234567',
          password: hashedPassword,
          role: Role.PROFESSOR,
          institutes: {
            connect: { id: defaultInstitute.id },
          },
        },
      });
      console.log('Default PROFESSOR seeded: professor@ufba.br');
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
          connect: data.instituteIds?.map((id) => ({ id })) || [],
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

  async findById(
    id: string,
  ): Promise<(Omit<User, 'password'> & { institutes: any[] }) | null> {
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

  async findAllForUser(requester: any): Promise<Omit<User, 'password'>[]> {
    let users;

    if (requester.role === Role.SUPERADMIN) {
      users = await this.prisma.user.findMany({
        include: { institutes: true },
        orderBy: { name: 'asc' },
      });
    } else {
      const instituteIds = requester.institutes?.map((inst) => inst.id) || [];
      users = await this.prisma.user.findMany({
        where: {
          role: Role.PROFESSOR,
          institutes: {
            some: {
              id: { in: instituteIds },
            },
          },
        },
        include: { institutes: true },
        orderBy: { name: 'asc' },
      });
    }

    // Strip passwords
    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      siape?: string;
      password?: string;
      role?: Role;
      instituteIds?: string[];
    },
  ): Promise<Omit<User, 'password'>> {
    // Check conflicts
    if (data.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { email: data.email, NOT: { id } },
      });
      if (existingEmail) {
        throw new ConflictException('E-mail já cadastrado');
      }
    }

    if (data.siape) {
      const existingSiape = await this.prisma.user.findFirst({
        where: { siape: data.siape, NOT: { id } },
      });
      if (existingSiape) {
        throw new ConflictException('SIAPE já cadastrado');
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.siape !== undefined) updateData.siape = data.siape || null;
    if (data.role) updateData.role = data.role;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    if (data.instituteIds) {
      updateData.institutes = {
        set: data.instituteIds.map((instId) => ({ id: instId })),
      };
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { institutes: true },
    });

    const { password, ...result } = user;
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
