import { Dispatch } from 'redux'
import { AUTH, IAuthType } from '../types/authType'
import { ALERT, IAlertType } from '../types/alertType'

import { errorsApiRes, IUserLogin, IUserRegister } from '../../utils/TypeScript'
import { postAPI, getAPI, postAPIWithoutHeaders } from '../../utils/FetchData'
import { PARAMS } from '../../common/params'
import { validLogin, validRegister } from '../../utils/Valid'
import { USER } from '../types/userType'

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
    localStorage.setItem('access-token', "");
    localStorage.setItem('refresh-token', "");
    localStorage.setItem('expiresAt', "");
    localStorage.setItem('username', "");
    dispatch({ type: ALERT, payload: { loading: true } })

    const res = await postAPIWithoutHeaders(`${PARAMS.ENDPOINT}auth/login`, userLogin);
    
    dispatch({ type: AUTH,payload: res.data })  

    dispatch({ type: ALERT, payload: {loading:false, success: res.data } })
    localStorage.setItem('access-token', res.data.authenticationToken);
    localStorage.setItem('refresh-token', res.data.refreshToken);
    localStorage.setItem('expiresAt', res.data.expiresAt);
    localStorage.setItem('username', res.data.userResponse.username);
  } catch (err: any) {
    dispatch({ type: ALERT, payload: {loading:false, errors: err.response.data } })
  }
}

export const getUserProfile = () => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
  try {
    const token = localStorage.getItem("access-token");
    if (token) {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI(`${PARAMS.ENDPOINT}me/about`);
      dispatch({ type: ALERT, payload: { loading: false } })

      dispatch({ type: AUTH,payload: res.data })
      dispatch({ type: ALERT, payload: { success: res.data } })
    }
  }catch (err: any) {
    if(err.response) {
      dispatch({ type: ALERT, payload: { errors: err.response.data },loading:false })
    } else {
      dispatch({ type: ALERT, payload: { errors: {message: "The Server has problem"}, loading:false } })
    }
    
    
  }
}

export const logout = () => 
async (dispatch: Dispatch<IAuthType | IAlertType >) => {
  
  console.log("calling logout");
  if(localStorage.getItem("access-token")) {
    try {
      await getAPI(`${PARAMS.ENDPOINT}auth/logout`)
      dispatch({type: AUTH, payload: {userResponse: undefined}})
      localStorage.removeItem('access-token')
      localStorage.removeItem('refresh-token')
      localStorage.removeItem('expiresAt')
      localStorage.removeItem('username')
      console.log("log out ...");
      
    } catch (err: any) {
      console.log(err);
      // dispatch({ type: ALERT, payload: { errors: err.response.data.msg } })
    }
  }
}

export const clearError = () => async (dispatch: Dispatch< IAlertType>) => {
  dispatch({ type: ALERT, payload: {errors: undefined }});
}