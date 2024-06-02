import { axiosWithAuth } from "@/api/interceptors";
import { IProfifeResponse, TypeUserFrom } from "@/types/user.types";

class UserService {
  private BASE_URL = "/user"

  async getUserProfile() {
    const response = await axiosWithAuth.get<IProfifeResponse>(this.BASE_URL)
    return response.data
  }

  async updateProfile(data: TypeUserFrom) {
    const response = await axiosWithAuth.put(this.BASE_URL, data)
    return response.data
  }
}

export const userService = new UserService()