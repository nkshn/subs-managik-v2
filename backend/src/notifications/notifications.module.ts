import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule],
  providers: [NotificationsService, UserService, PrismaService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
