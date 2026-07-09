import {
  Controller,
  Get,
  MessageEvent,
  Param,
  Patch,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { NotificationsService } from './notifications.service';

interface AuthenticatedRequest {
  user: AuthenticatedUser;
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.findAllForUser(req.user.id);
  }

  @Sse('stream')
  stream(@Req() req: AuthenticatedRequest): Observable<MessageEvent> {
    return this.notificationsService.getStream(req.user.id);
  }

  @Patch('read-all')
  markAllRead(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.markAllRead(req.user.id);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.notificationsService.markRead(id, req.user.id);
  }
}
