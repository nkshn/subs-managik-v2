import { axiosWithAuth } from "@/api/interceptors";
import { RequestedServiceFormInput } from "@/types/requested-service.types";

class RequestService {
  private BASE_URL = "/requested-service"

  async createRequestSerice(data: RequestedServiceFormInput) {
    const response = await axiosWithAuth.post(this.BASE_URL, data)
    return response.data
  }
}

export const requestService = new RequestService()
