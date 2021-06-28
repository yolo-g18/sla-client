import { Dispatch } from 'redux'
import { AUTH, IAuthType } from '../types/authType'
import { ALERT, IAlertType } from '../types/alertType'

import { IUserLogin, IUserRegister } from '../../utils/TypeScript'
import { postAPI, getAPI, postAPIWithoutHeaders } from '../../utils/FetchData'
import { PARAMS } from '../../common/params'

export const registerAction
  = (userRegister: IUserRegister) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
  try {
    dispatch({ type: ALERT, payload: { loading: true } })
    
    
    const res = await postAPIWithoutHeaders(`${PARAMS.ENDPOINT}auth/register`, userRegister)


    dispatch({ type: ALERT, payload: { success: res.data.msg } })
  } catch (err: any) {
    console.log(err.response);
    
    // dispatch({ type: ALERT, payload: { errors: err.response.data.msg } })   
  }
}