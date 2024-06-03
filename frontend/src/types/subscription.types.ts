import { IBase } from "./root.types"
import { IServiceResponse } from "./service.types"

export interface ISubscriptionResponse extends IBase {
  userId: string
  service: IServiceResponse
  price: number
  note?: string
}

// new types
export type Service = {
  id: string;
  fullName: string;
  shortName: string;
  backgroundColor: string;
};

export type Subscription = {
  id?: number;
  service: Service;
  price: number;
  note?: string;
  isNotifying?: boolean;
  nextPaymentAt: string;
};

export type SubscriptionFormInputs = {
  serviceId: string;
  note?: string;
  price: number;
  isNotifying?: boolean;
  nextPaymentAt: string;
};
