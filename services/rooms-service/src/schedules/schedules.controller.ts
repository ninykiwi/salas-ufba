import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

interface AuthenticatedRequest {
  user: AuthenticatedUser;
  headers: { authorization?: string };
}

@Controller('schedules')
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  // Precisa vir antes de ":id" para "today" não ser interpretado como um id.
  @Get('today')
  findToday(@Query('institute_id') institute_id?: string) {
    return this.schedulesService.findToday(institute_id);
  }

  @Get()
  findAll(
    @Query('room_id') room_id?: string,
    @Query('institute_id') institute_id?: string,
    @Query('date') date?: string,
    @Query('professor_id') professor_id?: string,
    @Query('status') status?: string,
  ) {
    return this.schedulesService.findAll({
      room_id,
      institute_id,
      date,
      professor_id,
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateScheduleDto, @Req() req: AuthenticatedRequest) {
    return this.schedulesService.create(
      dto,
      req.user,
      req.headers.authorization,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateScheduleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.schedulesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.schedulesService.remove(id, req.user);
  }
}
