import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Map, MapSchema } from './map.schema';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Map.name, schema: MapSchema }]),
  ],
  controllers: [MapsController],
  providers: [MapsService],
})
export class MapsModule {}
