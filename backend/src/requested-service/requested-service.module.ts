import { Module } from '@nestjs/common';
import { RequestedServiceService } from './requested-service.service';
import { RequestedServiceController } from './requested-service.controller';
import { PrismaService } from 'src/prisma.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TelegramModule],
  controllers: [RequestedServiceController],
  providers: [RequestedServiceService, PrismaService, UserService],
  exports: [RequestedServiceService]
})
export class RequestedServiceModule {}
