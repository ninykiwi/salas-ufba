import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Institute } from '@prisma/client';

@Injectable()
export class InstitutesService {
  constructor(private prisma: PrismaService) {}

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

  async create(data: { name: string; floors: number }): Promise<Institute> {
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

    return this.prisma.institute.create({
      data: {
        name: data.name,
        slug,
        floors: data.floors,
      },
    });
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

  async remove(id: string): Promise<void> {
    const institute = await this.prisma.institute.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!institute) {
      throw new NotFoundException('Instituto não encontrado');
    }

    if (institute.users.length > 0) {
      await this.prisma.institute.update({
        where: { id },
        data: { users: { set: [] } },
      });
    }

    await this.prisma.institute.delete({ where: { id } });
  }
}
