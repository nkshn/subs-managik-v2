import { Module } from "@nestjs/common"
import { AuthModule } from "./auth/auth.module"
import { ConfigModule } from "@nestjs/config"
import { UserModule } from "./user/user.module"
import { SubscriptionModule } from "./subscription/subscription.module"
import { ServiceModule } from "./service/service.module"
import { RequestedServiceModule } from './requested-service/requested-service.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		UserModule,
		SubscriptionModule,
		ServiceModule,
		RequestedServiceModule,
		TelegramModule,
	]
})
export class AppModule {}
