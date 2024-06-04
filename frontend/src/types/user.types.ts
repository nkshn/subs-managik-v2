import { IBase } from "./root.types"

export interface IUser extends IBase {
  name?: string
  email: string
  phone?: string
}

export interface ProfileFormInputs {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface IProfifeResponse {
  user: {
    id: string,
    name: string,
    email: string,
    phone: string,
  },
  stats: {
    totalSubscriptions: number
    totalRevenue: number
    totalRequestedSerices: number
  }
}
