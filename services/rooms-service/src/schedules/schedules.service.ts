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

const MAX_OCCURRENCES = 60;

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    private roomsService: RoomsService,
  ) {}

  async create(dto: CreateScheduleDto, user: AuthenticatedUser) {
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
    return this.scheduleModel.insertMany(docs);
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

    return schedule.save();
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
