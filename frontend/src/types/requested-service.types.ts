import { IBase } from "./root.types"

export interface RequestedServiceFormInput {
  name: string;
  url: string;
}

export interface IRequestService extends IBase {
  userId: string
  name: string
  url: string
}
