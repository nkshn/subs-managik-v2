import { IAuthResponse, ILoginForm, IRegisterForm } from "@/types/auth.types"

import { axioxWithoutAuth } from "@/api/interceptors"

import { removeTokenFromStorage, saveTokenStorage } from "./auth-token.service"

export const authService = {
  async logic(data: ILoginForm) {
    const response = await axioxWithoutAuth.post<IAuthResponse>(
      "/auth/login",
      data
    )

    if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

    return response
  },

  async register(data: IRegisterForm) {
    const response = await axioxWithoutAuth.post<IAuthResponse>(
      "/auth/register",
      data
    )

    if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

    return response
  },

  async getNewTokens() {
    const response = await axioxWithoutAuth.post<IAuthResponse>(
      "/auth/login/access-token"
    )

    if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

    return response
  },

  async logout() {
    const response = await axioxWithoutAuth.post<boolean>("/auth/logout")

    if (response.data) removeTokenFromStorage()
  }
}
