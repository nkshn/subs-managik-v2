import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestedService, User } from '@prisma/client';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(
    private configService: ConfigService
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new TelegramBot(token, { polling: true });
  }

  sendPlainMessage(message: string) {
    const chatId = this.configService.get<string>('TELEGRAM_BOT_CHAT_ID');

    return this.bot.sendMessage(chatId, message);
  }

  sendRequesterServiceNotifyMessage(requestedService: RequestedService, user: User) {
    const chatId = this.configService.get<string>('TELEGRAM_BOT_CHAT_ID');

    return this.bot.sendMessage(
      chatId,
      `<b>New requested service:</b>\n\n<b>Service Details:</b>\nId: <b>${requestedService.id}</b>\nName: <b>${requestedService.name}</b>\nURL: <b>${requestedService.url}</b>\n\n<b>Created by:</b>\nId: <b>${user.id}</b>\nName: <b>${user.name}</b>\nEmail: <b>${user.email}</b>\n`,
      { parse_mode: 'HTML' }
    );
  }
}
