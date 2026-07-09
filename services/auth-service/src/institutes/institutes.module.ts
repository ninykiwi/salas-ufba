import { Module } from '@nestjs/common';
import { InstitutesService } from './institutes.service';
import { InstitutesController } from './institutes.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  providers: [InstitutesService],
  controllers: [InstitutesController],
  exports: [InstitutesService],
})
export class InstitutesModule {}
