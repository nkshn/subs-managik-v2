import { IBase } from "./root.types"

export interface IRequestService extends IBase {
  userId: string
  name: string
  url: string
  pending: boolean
  accepted: boolean
}
