import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRequestedServiceDto, UpdateRequestedServiceDto } from './dto/requested-service.dto';

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

  async update(requestedServiceId: string, dto: UpdateRequestedServiceDto) {
    return this.prisma.requestedService.update({
      where: { id: requestedServiceId },
      data: dto,
    })
  }

  async delete(requestedServiceId: string) {
    return this.prisma.requestedService.delete({
      where: { id: requestedServiceId },
    })
  }

  async getAll() {
    return this.prisma.requestedService.findMany()
  }

  async getAllByUserId(userId: string) {
    return this.prisma.requestedService.findMany({
      where: {
        userId,
      },
    })
  }

  async getOneById(requestedServiceId: string) {
    return this.prisma.requestedService.findFirst({
      where: { id: requestedServiceId },
    })
  }
}
