import { Module } from '@nestjs/common';
import { RequestedServiceService } from './requested-service.service';
import { RequestedServiceController } from './requested-service.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RequestedServiceController],
  providers: [RequestedServiceService, PrismaService],
  exports: [RequestedServiceService]
})
export class RequestedServiceModule {}
