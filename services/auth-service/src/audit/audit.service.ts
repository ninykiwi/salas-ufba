import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    admin_id: string;
    admin_name: string;
    admin_role: string;
    action: string;
    resource_type: string;
    resource_id?: string;
    description: string;
  }) {
    return this.prisma.auditLog.create({ data });
  }

  async findAll(filters?: { admin_id?: string; resource_type?: string }) {
    return this.prisma.auditLog.findMany({
      where: filters,
      orderBy: { created_at: 'desc' },
    });
  }
}
