import { Dispatch } from 'redux'
import { AUTH, IAuthType } from '../types/authType'
import { ALERT, IAlertType } from '../types/alertType'

import { errorsApiRes, IUserLogin, IUserRegister } from '../../utils/TypeScript'
import { postAPI, getAPI, postAPIWithoutHeaders } from '../../utils/FetchData'
import { PARAMS } from '../../common/params'
import { validRegister } from '../../utils/Valid'

export const registerAction
  = (userRegister: IUserRegister) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    dispatch({ type: ALERT, payload: { loading: true } })

    const check = validRegister(userRegister);
    
    if(Object.keys(check).length !== 0) {
      let errorRes: errorsApiRes  = {
        errors: check
      }
      return dispatch({ type: ALERT, payload: { errors: errorRes, loading: false} })
    }

  try {
    dispatch({ type: ALERT, payload: { loading: true } })
    const res = await postAPIWithoutHeaders(`${PARAMS.ENDPOINT}auth/register`, userRegister);
    dispatch({ type: ALERT, payload: { success: res.data } })
  } catch (err: any) {
    dispatch({ type: ALERT, payload: { errors: err.response.data} })   
  }
}