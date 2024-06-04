import { axiosWithAuth } from "@/api/interceptors";
import { IProfifeResponse, ProfileFormInputs } from "@/types/user.types";
import { AxiosError } from "axios";

class UserService {
  private BASE_URL = "/user"

  async getUserProfile() {
    try {
      const response = await axiosWithAuth.get<IProfifeResponse>(`${this.BASE_URL}/profile`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.status === 401) {
        return null
      }

      throw axiosError
    }
  }

  async updateProfile(data: ProfileFormInputs) {
    const response = await axiosWithAuth.put(this.BASE_URL, data)
    return response.data
  }
}

export const userService = new UserService()