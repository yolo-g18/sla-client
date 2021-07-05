import { Dispatch } from 'redux'
import { AUTH, IAuthType } from '../types/authType'
import { ALERT, IAlertType } from '../types/alertType'

import { errorsApiRes, IUserLogin, IUserRegister } from '../../utils/TypeScript'
import { postAPI, getAPI, postAPIWithoutHeaders } from '../../utils/FetchData'
import { PARAMS } from '../../common/params'
import { validLogin, validRegister } from '../../utils/Valid'

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

export const loginAction = (userLogin: IUserLogin) => 
async (dispatch: Dispatch<IAuthType | IAlertType>) => {
  dispatch({ type: ALERT, payload: { loading: true } })
  const check = validLogin(userLogin);
    
    if(Object.keys(check).length !== 0) {
      let errorRes: errorsApiRes  = {
        errors: check
      }
      return dispatch({ type: ALERT, payload: { errors: errorRes, loading: false} })
    }

  try {
    dispatch({ type: ALERT, payload: { loading: true } })

    const res = await postAPIWithoutHeaders(`${PARAMS.ENDPOINT}auth/login`, userLogin);
    
    dispatch({ type: AUTH,payload: res.data })  

    dispatch({ type: ALERT, payload: { success: res.data } })
    localStorage.setItem('access-token', res.data.authenticationToken);
    localStorage.setItem('refresh-token', res.data.refreshToken);
    localStorage.setItem('expiresAt', res.data.expiresAt);
    
  } catch (err: any) {
    dispatch({ type: ALERT, payload: { errors: err.response.data } })
  }
}

export const getUserProfile = () => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
  try {
    const token = localStorage.getItem("access-token");
    if (token) {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI(`${PARAMS.ENDPOINT}me/about`);

      dispatch({ type: AUTH,payload: res.data })
      dispatch({ type: ALERT, payload: { success: res.data } })
  
    }
  }catch (err: any) {
    if(err.responserr) {
      dispatch({ type: ALERT, payload: { errors: err.response.data } })
    } else {
      dispatch({ type: ALERT, payload: { errors: {message: "The Server has problem"} } })
    }
    
  }
}

export const logout = () => 
async (dispatch: Dispatch<IAuthType | IAlertType>) => {
  
  console.log("calling logout");
  
  try {
    await getAPI(`${PARAMS.ENDPOINT}auth/logout`)
    localStorage.removeItem('access-token')
    localStorage.removeItem('refresh-token')
    localStorage.removeItem('expiresAt')
  } catch (err: any) {
    dispatch({ type: ALERT, payload: { errors: err.response.data.msg } })
  }
}

export const clearError = () => async (dispatch: Dispatch< IAlertType>) => {
  dispatch({ type: ALERT, payload: {errors: undefined }});
}