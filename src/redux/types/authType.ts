import { IUser } from '../../utils/TypeScript'

export const AUTH = 'AUTH'

export interface IAuth {
  authenticationToken?: string
  refreshToken?: string
  expiresAt?: Date
  userResponse?: IUser
}

export interface IAuthType{
  type: typeof AUTH
  payload: IAuth
}
