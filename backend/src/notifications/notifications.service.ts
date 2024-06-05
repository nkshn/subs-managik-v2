import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addMonths, format, isBefore, isToday, parseISO, setMonth, setYear } from 'date-fns';
import { UserService } from 'src/user/user.service';
import { Twilio } from 'twilio';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private twilioClient: Twilio;

  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  async handleEveryMinuteCron() {
    this.logger.log('Cron job every day at 21:00 started...');

    const users = await this.userService.getAllWithSubscriptionsAndService();

    let totalUsers = 0;
    let totalSubscriptions = 0;
    let successCount = 0;
    let failureCount = 0;

    for (const user of users) {
      if (user.subscriptions.length > 0) {
        totalUsers++;
      }

      for (const subscription of user.subscriptions) {
        const adjustedDate = this.adjustNextPaymentDate(subscription.nextPaymentAt.toISOString());user

        if (isToday(adjustedDate) && subscription.isNotifying) {
          this.logger.log(`Sending SMS notification to user ${user.name} to ${user.phone} for service ${subscription.service.fullName} with price ${subscription.price}$...`);
          totalSubscriptions++;

          try {
            await this.sendSubscriptionNotificationSMS(
              user.phone,
              subscription.service.fullName,
              adjustedDate
            );

            successCount++;
          } catch (error) {
            failureCount++;
          }
        }
      }
    }

    this.logger.log(`Cron job every day at 21:00 finished. Total users notified: ${totalUsers}, total subscriptions: ${totalSubscriptions}. Success: ${successCount}, Failures: ${failureCount}`);
  }

  /**
   * This function is used to adjust the next payment date to the current month and year.
   * @param nextPaymentAt string - the next payment date
   * @returns Date object
   */
  private adjustNextPaymentDate(nextPaymentAt: string): Date {
    const now = new Date();
    let nextPaymentDate = parseISO(nextPaymentAt);

    nextPaymentDate = setYear(nextPaymentDate, now.getFullYear());
    nextPaymentDate = setMonth(nextPaymentDate, now.getMonth());

    if (isBefore(nextPaymentDate, now) && !isToday(nextPaymentDate)) {
      nextPaymentDate = addMonths(nextPaymentDate, 1);
    }

    return nextPaymentDate;
  }

  private async sendSubscriptionNotificationSMS(phone: string, serviceName: string, nextPaymentDate: Date) {
    const formattedDate = format(nextPaymentDate, 'dd.MM.yyyy');
    const message = `Reminder: Your subscription to ${serviceName} is due on ${formattedDate}. So today will be payment day.`;

    try {
      await this.twilioClient.messages.create({
        body: message,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: phone,
      });
      this.logger.log(`Succesfully sent SMS to ${phone}: ${message}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${phone}: ${error.message}`);
      throw error;
    }
  }
}
