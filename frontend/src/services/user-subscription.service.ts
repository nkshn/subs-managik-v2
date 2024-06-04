import { axiosWithAuth } from "@/api/interceptors";
import { SubscriptionFormInputs } from "@/types/subscription.types";

class UserSubscriptionService {
  private BASE_URL = "/user/subscription"

  async getAllUserSubscriptions() {
    const response = await axiosWithAuth.get(this.BASE_URL)
    return response.data
  }

  async createNewSubscription(data: SubscriptionFormInputs) {
    const response = await axiosWithAuth.post(this.BASE_URL, data)
    return response.data
  }

  async updateSubscription(id: string, data: SubscriptionFormInputs) {
    const response = await axiosWithAuth.put(`${this.BASE_URL}/${id}`, data)
    return response.data
  }

  async deleteSubscription(id: string) {
    const response = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)
    return response.data
  }
}

export const userSubscriptionService = new UserSubscriptionService()
