import { Controller, Get } from "@nestjs/common"
import { TestRouteService } from "./test-route.service"

@Controller("test")
export class TestRouteController {
	constructor(private readonly testRouteService: TestRouteService) {}

	@Get()
	findAll() {
		return this.testRouteService.findAll()
	}
}
