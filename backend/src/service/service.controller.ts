import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	HttpCode,
	UsePipes,
	ValidationPipe,
	Put
} from "@nestjs/common"
import { ServiceService } from "./service.service"
import { CreateServiceDto, UpdateServiceDto } from "./dto/service.dto"

@Controller("service")
export class ServiceController {
	constructor(private readonly serviceService: ServiceService) {}

	@Get()
	async getAll() {
		return this.serviceService.getAll()
	}

	@Get(":id")
	async getOne(@Param("id") id: string) {
		return this.serviceService.getOneById(id)
	}

	// TODO: add admin guard
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	async create(@Body() dto: CreateServiceDto) {
		return this.serviceService.create(dto)
	}

	// TODO: add admin guard
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(":id")
	async update(@Param("id") serviceId: string, @Body() dto: UpdateServiceDto) {
		return this.serviceService.update(serviceId, dto)
	}

	// TODO: add admin guard
	@HttpCode(200)
	@Delete(":id")
	async delete(@Param("id") serviceId: string) {
		return this.serviceService.delete(serviceId)
	}
}
