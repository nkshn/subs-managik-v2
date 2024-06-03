import { Controller, Get, Post, Body } from "@nestjs/common"
import { RequestedServiceService } from "./requested-service.service"
import {
	CreateRequestedServiceDto,
} from "./dto/requested-service.dto"
import { CurrentUser } from "src/auth/decorators/user.decorator"
import { Auth } from "src/auth/decorators/auth.decorator"

@Controller("requested-service")
export class RequestedServiceController {
	constructor(
		private readonly requestedServiceService: RequestedServiceService
	) {}

	@Get()
	@Auth()
	async getAllByUserId(@CurrentUser("id") userId: string) {
		return this.requestedServiceService.getAllByUserId(userId)
	}

	@Post()
	@Auth()
	async create(
		@CurrentUser("id") userId: string,
		@Body() dto: CreateRequestedServiceDto
	) {
		return this.requestedServiceService.create(userId, dto)
	}
}
