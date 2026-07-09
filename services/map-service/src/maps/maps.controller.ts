import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { MapsService } from './maps.service';
import { SaveMapDto } from './dto/save-map.dto';

@Controller('maps')
export class MapsController {
  constructor(private mapsService: MapsService) {}

  @Get()
  findOne(
    @Query('institute_id') institute_id: string,
    @Query('floor') floor: string,
  ) {
    const floorNumber = Number(floor);
    if (!institute_id || Number.isNaN(floorNumber)) {
      throw new BadRequestException('institute_id e floor são obrigatórios');
    }
    return this.mapsService.findOne(institute_id, floorNumber);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  save(@Body() dto: SaveMapDto) {
    return this.mapsService.upsert(dto);
  }
}
