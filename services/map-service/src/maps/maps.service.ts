import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Map, MapDocument } from './map.schema';
import { SaveMapDto } from './dto/save-map.dto';

@Injectable()
export class MapsService {
  constructor(
    @InjectModel(Map.name) private mapModel: Model<MapDocument>,
  ) {}

  async findOne(institute_id: string, floor: number): Promise<MapDocument> {
    const map = await this.mapModel.findOne({ institute_id, floor }).exec();
    if (!map) {
      throw new NotFoundException('Mapa não encontrado');
    }
    return map;
  }

  upsert(dto: SaveMapDto) {
    return this.mapModel
      .findOneAndUpdate(
        { institute_id: dto.institute_id, floor: dto.floor },
        dto,
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .exec();
  }
}
