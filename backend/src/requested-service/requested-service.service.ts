import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRequestedServiceDto } from './dto/requested-service.dto';

@Injectable()
export class RequestedServiceService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateRequestedServiceDto) {
    return this.prisma.requestedService.create({
      data: {
        ...dto,
        userId: userId,
      },
    })
  }

  async getAllByUserId(userId: string) {
    return this.prisma.requestedService.findMany({
      where: {
        userId,
      },
    })
  }
}
