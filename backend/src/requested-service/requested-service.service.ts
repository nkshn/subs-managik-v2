import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRequestedServiceDto } from './dto/requested-service.dto';
import { TelegramService } from 'src/telegram/telegram.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RequestedServiceService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private telegramService: TelegramService,
  ) {}

  async create(userId: string, dto: CreateRequestedServiceDto) {
    const requestedService = await this.prisma.requestedService.create({
      data: {
        ...dto,
        userId: userId,
      },
    })

    const user = await this.userService.getById(userId)

    await this.telegramService.sendRequesterServiceNotifyMessage(requestedService, user)

    return requestedService
  }

  async getAllByUserId(userId: string) {
    return this.prisma.requestedService.findMany({
      where: {
        userId,
      },
    })
  }
}
