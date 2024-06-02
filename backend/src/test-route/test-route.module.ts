import { Module } from "@nestjs/common"
import { TestRouteService } from "./test-route.service"
import { TestRouteController } from "./test-route.controller"

@Module({
	controllers: [TestRouteController],
	providers: [TestRouteService]
})
export class TestRouteModule {}
