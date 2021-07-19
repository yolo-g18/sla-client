import { Dispatch } from 'redux'
import { SEARCH, ISearchType } from '../types/searchType'
import { ALERT, IAlertType } from '../types/alertType'
import router from 'next/router'

export const putSearchKeyword = (keyword: string) => (dispatch: Dispatch<ISearchType | IAlertType>) => {
    dispatch({ type: ALERT, payload: { loading: true } })
    dispatch({type: SEARCH, payload: {keyword: keyword}});
    if(keyword.length !== 0) 
        router.push("/search/set");
    dispatch({ type: ALERT, payload: { loading: false } });
}