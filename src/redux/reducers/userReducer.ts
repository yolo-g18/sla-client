
import { USER, IUserType } from '../types/userType';
import { IUser } from '../../utils/TypeScript';


const userReducer = (state: IUser = {}, action: IUserType): IUser => {
  switch (action.type){
    case USER:
      return action.payload
    default:
      return state
  }
}

export default userReducer;