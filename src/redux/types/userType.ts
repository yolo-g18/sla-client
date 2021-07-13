import { IUser } from "../../utils/TypeScript";

export const USER = 'USER'

export interface IUserType {
    type: typeof USER
    payload: IUser
}