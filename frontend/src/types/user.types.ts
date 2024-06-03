import { IRequestService } from "./requested-service.types"
import { IBase } from "./root.types"
import { ISubscriptionResponse } from "./subscription.types"

export interface IUser extends IBase {
  name?: string
  email: string
  phone?: string
}

export interface ISubscriptionsResponse extends IUser {
  subscriptions: ISubscriptionResponse[]
  requestedSerices: IRequestService[]
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

export type TypeUserFrom = Omit<IUser, "id"> & { password?: string }
