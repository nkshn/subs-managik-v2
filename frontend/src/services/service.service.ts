import { axioxWithoutAuth } from "@/api/interceptors";
import { IServiceResponse } from "@/types/service.types";

class ServiceForSubscriptionService {
  private BASE_URL = "/service"

  async getAllServices() {
    const response = await axioxWithoutAuth.get<IServiceResponse[]>(this.BASE_URL)
    return response.data
  }
}

export const serviceForSubscriptionService = new ServiceForSubscriptionService()