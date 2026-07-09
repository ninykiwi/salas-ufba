import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { randomUUID } from 'crypto';
import { Schedule, ScheduleDocument } from './schemas/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { generateOccurrenceDates } from './utils/recurrence';
import { todayInBahia } from './utils/today';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { RoomsService } from '../rooms/rooms.service';
import { NotificationsService } from '../notifications/notifications.service';

const MAX_OCCURRENCES = 60;
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || 'http://auth-service:3002';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    private roomsService: RoomsService,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    dto: CreateScheduleDto,
    user: AuthenticatedUser,
    authorizationHeader?: string,
  ) {
    const room = await this.roomsService.findOne(dto.room_id);
    if (dto.expected_audience > room.capacity) {
      throw new BadRequestException(
        'O público estimado excede a capacidade máxima da sala',
      );
    }

    const { recurrence_end_date, ...rest } = dto;
    const base = {
      ...rest,
      professor_id: user.id,
      professor_name: user.name,
      created_by: user.id,
    };

    if (rest.recurrence === 'unico') {
      const created = await this.scheduleModel.create(base);
      await this.notifyAdmins(created, room.name, authorizationHeader);
      return [created];
    }

    if (!recurrence_end_date) {
      throw new BadRequestException(
        'recurrence_end_date é obrigatório para recorrência semanal/quinzenal',
      );
    }

    const step = rest.recurrence === 'semanal' ? 7 : 14;
    const dates = generateOccurrenceDates(rest.date, recurrence_end_date, step);

    if (dates.length === 0) {
      throw new BadRequestException(
        'recurrence_end_date deve ser posterior ou igual à data inicial',
      );
    }
    if (dates.length > MAX_OCCURRENCES) {
      throw new BadRequestException(
        `Intervalo de recorrência gera ocorrências demais (máx. ${MAX_OCCURRENCES})`,
      );
    }

    const recurrence_group_id = randomUUID();
    const docs = dates.map((date) => ({ ...base, date, recurrence_group_id }));
    const created = await this.scheduleModel.insertMany(docs);
    await this.notifyAdmins(created[0], room.name, authorizationHeader);
    return created;
  }

  private async notifyAdmins(
    schedule: Pick<Schedule, 'institute_id' | 'professor_name' | 'date'> & {
      _id: unknown;
    },
    roomName: string,
    authorizationHeader?: string,
  ): Promise<void> {
    if (!authorizationHeader) return;
    try {
      const response = await fetch(
        `${AUTH_SERVICE_URL}/users?institute_id=${schedule.institute_id}&role=ADMIN`,
        { headers: { Authorization: authorizationHeader } },
      );
      if (!response.ok) return;
      const admins: { id: string }[] = await response.json();
      await Promise.all(
        admins.map((admin) =>
          this.notificationsService.create({
            user_id: admin.id,
            institute_id: schedule.institute_id,
            type: 'nova_solicitacao',
            title: 'Nova Solicitação de Reserva',
            message: `${schedule.professor_name} solicitou reserva de ${roomName} em ${schedule.date}`,
            schedule_id: String(schedule._id),
          }),
        ),
      );
    } catch {
      // Falha ao notificar admins não deve impedir a criação da solicitação.
    }
  }

  private async notifyProfessor(schedule: ScheduleDocument): Promise<void> {
    try {
      const room = await this.roomsService.findOne(schedule.room_id);
      const approved = schedule.status === 'confirmado';
      await this.notificationsService.create({
        user_id: schedule.professor_id,
        institute_id: schedule.institute_id,
        type: approved ? 'solicitacao_aprovada' : 'solicitacao_recusada',
        title: approved ? 'Solicitação Aprovada' : 'Solicitação Recusada',
        message: `Sua reserva de ${room.name} em ${schedule.date} foi ${
          approved ? 'aprovada' : 'recusada'
        }`,
        schedule_id: String(schedule._id),
      });
    } catch {
      // Falha ao notificar o professor não deve impedir a atualização do agendamento.
    }
  }

  findAll(filters: {
    room_id?: string;
    institute_id?: string;
    date?: string;
    professor_id?: string;
    status?: string;
  }) {
    const query: Record<string, string> = {};
    if (filters.room_id) query.room_id = filters.room_id;
    if (filters.institute_id) query.institute_id = filters.institute_id;
    if (filters.date) query.date = filters.date;
    if (filters.professor_id) query.professor_id = filters.professor_id;
    if (filters.status) query.status = filters.status;
    return this.scheduleModel.find(query).sort({ date: 1, start_time: 1 }).exec();
  }

  findToday(institute_id?: string) {
    const query: Record<string, string> = { date: todayInBahia() };
    if (institute_id) query.institute_id = institute_id;
    return this.scheduleModel.find(query).sort({ start_time: 1 }).exec();
  }

  async findOne(id: string): Promise<ScheduleDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    const schedule = await this.scheduleModel.findById(id).exec();
    if (!schedule) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    return schedule;
  }

  async update(id: string, dto: UpdateScheduleDto, user: AuthenticatedUser) {
    const schedule = await this.findOne(id);
    this.assertCanModify(schedule, user);
    const previousStatus = schedule.status;
    // dto pode ter chaves declaradas na classe com valor `undefined` (não
    // enviadas no body) — só aplicamos as que realmente vieram preenchidas,
    // senão Object.assign apagaria campos obrigatórios do documento.
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        (schedule as unknown as Record<string, unknown>)[key] = value;
      }
    }

    if (dto.expected_audience !== undefined) {
      const room = await this.roomsService.findOne(schedule.room_id);
      if (schedule.expected_audience > room.capacity) {
        throw new BadRequestException(
          'O público estimado excede a capacidade máxima da sala',
        );
      }
    }

    const saved = await schedule.save();

    if (
      dto.status &&
      dto.status !== previousStatus &&
      (dto.status === 'confirmado' || dto.status === 'cancelado')
    ) {
      await this.notifyProfessor(saved);
    }

    return saved;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    const schedule = await this.findOne(id);
    this.assertCanModify(schedule, user);
    await schedule.deleteOne();
  }

  private assertCanModify(
    schedule: ScheduleDocument,
    user: AuthenticatedUser,
  ): void {
    if (user.role !== 'PROFESSOR') {
      return;
    }
    if (schedule.created_by !== user.id) {
      throw new ForbiddenException(
        'Você só pode editar solicitações que você mesmo criou',
      );
    }
    if (schedule.status !== 'pendente') {
      throw new ForbiddenException(
        'Não é possível editar uma solicitação já processada',
      );
    }
  }
}
