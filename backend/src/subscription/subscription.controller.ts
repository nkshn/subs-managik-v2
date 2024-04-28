import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from "@nestjs/common"
import { SubscriptionService } from "./subscription.service"
import { CurrentUser } from "src/auth/decorators/user.decorator"
import { Auth } from "src/auth/decorators/auth.decorator"
import {
	CreateSubscriptionDto,
	UpdateSubscriptionDto
} from "./dto/subscription.dto"

@Controller("user/subscription")
export class SubscriptionController {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	@Get()
	@Auth()
	async getAllByUserId(@CurrentUser("id") userId: string) {
		return this.subscriptionService.getAllByUserId(userId)
	}

	@Get(":id")
	@Auth()
	async getOneByUserId(
		@Param("id") subscriptionId: string,
		@CurrentUser("id") userId: string
	) {
		return this.subscriptionService.getOneByUserId(subscriptionId, userId)
	}

	@Get()
	@Auth()
	async getByUserIdAndServiceId(
		@CurrentUser("id") userId: string,
		@Body() serviceId: string
	) {
		return this.subscriptionService.getByUserIdAndServiceId(userId, serviceId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(
		@CurrentUser("id") userId: string,
		@Body() dto: CreateSubscriptionDto
	) {
		return this.subscriptionService.create(userId, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(":id")
	@Auth()
	async update(
		@CurrentUser("id") userId: string,
		@Body() dto: UpdateSubscriptionDto,
		@Param("id") subscriptionId: string
	) {
		return this.subscriptionService.update(dto, subscriptionId, userId)
	}

	@HttpCode(200)
	@Delete(":id")
	@Auth()
	async deleteUserSubscription(
		@CurrentUser("id") userId: string,
		@Param("id") subscriptionId: string
	) {
		return this.subscriptionService.deleteUserSubscription(
			userId,
			subscriptionId
		)
	}
}
