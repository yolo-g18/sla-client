import { IUser } from '../../utils/TypeScript'

export const AUTH = 'AUTH'

export interface IAuth {
  authenticationToken?: string
  refreshToken?: string
  expiresAt?: Date
  userResponse?: IUser
  roles?:string[]
}

export interface IAuthType{
  type: typeof AUTH
  payload: IAuth
}
