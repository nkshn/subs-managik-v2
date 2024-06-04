import { IBase } from "./root.types"

export type Service = {
  id: string;
  fullName: string;
  shortName: string;
  backgroundColor: string;
};

export type Subscription = {
  id?: string;
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
