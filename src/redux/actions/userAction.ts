import { Dispatch } from 'redux'
import { USER, IUserType } from '../types/userType'
import { ALERT, IAlertType } from '../types/alertType'

import { getAPI } from '../../utils/FetchData'
import { PARAMS } from '../../common/params'

export const getUserByUsername = (username: string) => async (dispatch: Dispatch<IUserType | IAlertType>) => {
    try {
        dispatch({ type: ALERT, payload: { loading: true } })
        const userRes = await getAPI(`${PARAMS.ENDPOINT}me/about/${username}`);
        
        dispatch({ type: USER,payload: userRes.data });
        dispatch({ type: ALERT, payload: { loading: false } });
    }catch (err: any) {
        dispatch({ type: ALERT, payload: { loading: false } })
        if(err.response) {
            dispatch({ type: ALERT, payload: { errors: err.response.data } })
          } else {
            dispatch({ type: ALERT, payload: { errors: {message: "The Server has problem"} } })
        }
        //push to error page
    }
}