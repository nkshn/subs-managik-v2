import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common"
import { RequestedServiceService } from "./requested-service.service"
import {
	CreateRequestedServiceDto,
	UpdateRequestedServiceDto
} from "./dto/requested-service.dto"
import { CurrentUser } from "src/auth/decorators/user.decorator"
import { Auth } from "src/auth/decorators/auth.decorator"

@Controller("requested-service")
export class RequestedServiceController {
	constructor(
		private readonly requestedServiceService: RequestedServiceService
	) {}

	@Get()
	async getAll() {
		return this.requestedServiceService.getAll()
	}

	@Get(":id")
	async getOne(@Param("id") requestedServiceId: string) {
		return this.requestedServiceService.getOneById(requestedServiceId)
	}

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

	@Put(":id")
	async update(
		@Param("id") id: string,
		@Body() dto: UpdateRequestedServiceDto
	) {
		return this.requestedServiceService.update(id, dto)
	}

	@Delete(":id")
	async delete(@Param("id") id: string) {
		return this.requestedServiceService.delete(id)
	}
}
