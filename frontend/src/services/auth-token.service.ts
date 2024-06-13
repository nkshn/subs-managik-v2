import Cookies from "js-cookie"

export enum EnumTokens {
  "ACCESS_TOKEN" = "accessToken",
  "REFRESH_TOKEN" = "refreshToken",
}

export const getAccessToken = () => {
  const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
  return accessToken || null
}

export const saveTokenStorage = (accessToken: string) => {
  Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
    domain: process.env.APP_DOMAIN_NAME,
    sameSite: "strict",
    expires: 7
  })
}

export const removeTokenFromStorage = () => {
  Cookies.remove(EnumTokens.ACCESS_TOKEN)
}