import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  create(dto: CreateRoomDto) {
    return this.roomModel.create(dto);
  }

  findAll(filters: { institute_id?: string; status?: string; floor?: string }) {
    const query: Record<string, string> = {};
    if (filters.institute_id) query.institute_id = filters.institute_id;
    if (filters.status) query.status = filters.status;
    if (filters.floor) query.floor = filters.floor;
    return this.roomModel.find(query).sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<RoomDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Sala não encontrada');
    }
    const room = await this.roomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException('Sala não encontrada');
    }
    return room;
  }

  async update(id: string, dto: UpdateRoomDto) {
    const room = await this.findOne(id);
    // dto pode ter chaves declaradas na classe com valor `undefined` (não
    // enviadas no body) — só aplicamos as que realmente vieram preenchidas,
    // senão Object.assign apagaria campos obrigatórios do documento.
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        (room as unknown as Record<string, unknown>)[key] = value;
      }
    }
    return room.save();
  }

  async remove(id: string): Promise<void> {
    const room = await this.findOne(id);
    await room.deleteOne();
  }

  async removeByInstitute(institute_id: string): Promise<void> {
    await this.roomModel.deleteMany({ institute_id }).exec();
  }
}
