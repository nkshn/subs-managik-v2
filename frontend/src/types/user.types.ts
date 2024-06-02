import { IRequestService } from "./requested-service.types"
import { IBase } from "./root.types"
import { ISubscriptionResponse } from "./subscription.types"

export interface IUser extends IBase {
  name?: string
  email: string
  phone?: string
  logo?: string
}

export interface ISubscriptionsResponse extends IUser {
  subscriptions: ISubscriptionResponse[]
  requestedSerices: IRequestService[]
}

export interface IProfifeResponse {
  user: IUser
}

export type TypeUserFrom = Omit<IUser, "id"> & { password?: string }
