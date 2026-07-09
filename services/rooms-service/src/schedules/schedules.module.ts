import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from './schemas/schedule.schema';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { RoomsModule } from '../rooms/rooms.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    RoomsModule,
    NotificationsModule,
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
