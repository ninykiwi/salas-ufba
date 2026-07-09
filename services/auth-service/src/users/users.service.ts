import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuditService } from '../audit/audit.service';

interface Actor {
  id: string;
  name: string;
  role: string;
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(
    data: {
      name: string;
      email: string;
      siape?: string;
      password: string;
      role: Role;
      instituteIds?: string[];
    },
    actor: Actor,
  ): Promise<Omit<User, 'password'>> {
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

    await this.auditService.log({
      admin_id: actor.id,
      admin_name: actor.name,
      admin_role: actor.role,
      action: 'CREATE_USER',
      resource_type: 'usuario',
      resource_id: result.id,
      description: `Criou o usuário ${result.name} (${result.email})`,
    });

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
        where: {
          role: { not: Role.SUPERADMIN },
        },
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

  async findByInstituteAndRole(
    instituteId: string,
    role: Role,
  ): Promise<{ id: string; name: string; email: string }[]> {
    return this.prisma.user.findMany({
      where: {
        role,
        institutes: { some: { id: instituteId } },
      },
      select: { id: true, name: true, email: true },
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
    actor: Actor,
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

    await this.auditService.log({
      admin_id: actor.id,
      admin_name: actor.name,
      admin_role: actor.role,
      action: 'UPDATE_USER',
      resource_type: 'usuario',
      resource_id: result.id,
      description: `Editou o usuário ${result.name}`,
    });

    return result;
  }

  async delete(id: string, actor: Actor): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    await this.prisma.user.delete({
      where: { id },
    });

    if (user) {
      await this.auditService.log({
        admin_id: actor.id,
        admin_name: actor.name,
        admin_role: actor.role,
        action: 'DELETE_USER',
        resource_type: 'usuario',
        resource_id: id,
        description: `Removeu o usuário ${user.name} (${user.email})`,
      });
    }
  }
}
