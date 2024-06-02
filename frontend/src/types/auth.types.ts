import { IUser } from "./user.types"

export interface ILoginForm {
  email: string
  password: string
}

export interface IRegisterForm extends ILoginForm {
  name: string
}

export interface IAuthResponse {
  accessToken: string
  user: IUser
}
