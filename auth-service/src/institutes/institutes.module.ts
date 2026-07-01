import { Module } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { InstitutesController } from './institutes.controller';

@Module({
  providers: [InstitutesService],
  controllers: [InstitutesController],
  exports: [InstitutesService],
})
export class InstitutesModule {}
