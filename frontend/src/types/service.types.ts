import { IBase } from "./root.types"

export interface IServiceResponse extends IBase {
  name: string
  url: string
  logo: string
}

export type TypeServiceFormState = Partial<Omit<IServiceResponse, "id">>
