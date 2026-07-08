import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Institute } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

const ROOMS_SERVICE_URL =
  process.env.ROOMS_SERVICE_URL || 'http://rooms-service:3003';

interface Actor {
  id: string;
  name: string;
  role: string;
}

@Injectable()
export class InstitutesService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  async create(
    data: { name: string; floors: number },
    actor: Actor,
  ): Promise<Institute> {
    const slug = this.slugify(data.name);

    // Check if name or slug already exists
    const existing = await this.prisma.institute.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
      },
    });

    if (existing) {
      throw new ConflictException(
        'Instituto já cadastrado (nome ou slug duplicado)',
      );
    }

    const institute = await this.prisma.institute.create({
      data: {
        name: data.name,
        slug,
        floors: data.floors,
      },
    });

    await this.auditService.log({
      admin_id: actor.id,
      admin_name: actor.name,
      admin_role: actor.role,
      action: 'CREATE_INSTITUTE',
      resource_type: 'instituto',
      resource_id: institute.id,
      description: `Criou o instituto ${institute.name}`,
    });

    return institute;
  }

  async findAll(): Promise<Institute[]> {
    return this.prisma.institute.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Institute | null> {
    return this.prisma.institute.findUnique({
      where: { id },
    });
  }

  async remove(
    id: string,
    authorizationHeader: string,
    actor: Actor,
  ): Promise<{
    hasLinkedUsers: boolean;
    hasLinkedRooms: boolean;
    linkedUsersCount: number;
    linkedRoomsCount: number;
  }> {
    const institute = await this.prisma.institute.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!institute) {
      throw new NotFoundException('Instituto não encontrado');
    }

    const roomsResponse = await fetch(
      `${ROOMS_SERVICE_URL}/rooms?institute_id=${id}`,
    );
    const rooms: unknown[] = roomsResponse.ok ? await roomsResponse.json() : [];

    if (institute.users.length > 0) {
      await this.prisma.institute.update({
        where: { id },
        data: { users: { set: [] } },
      });
    }

    if (rooms.length > 0) {
      await fetch(`${ROOMS_SERVICE_URL}/rooms/by-institute/${id}`, {
        method: 'DELETE',
        headers: { Authorization: authorizationHeader },
      });
    }

    await this.prisma.institute.delete({ where: { id } });

    await this.auditService.log({
      admin_id: actor.id,
      admin_name: actor.name,
      admin_role: actor.role,
      action: 'DELETE_INSTITUTE',
      resource_type: 'instituto',
      resource_id: id,
      description: `Removeu o instituto ${institute.name}`,
    });

    return {
      hasLinkedUsers: institute.users.length > 0,
      hasLinkedRooms: rooms.length > 0,
      linkedUsersCount: institute.users.length,
      linkedRoomsCount: rooms.length,
    };
  }
}
