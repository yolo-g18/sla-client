import { Dispatch } from 'redux'
import { SEARCH, ISearchType } from '../types/searchType'
import { ALERT, IAlertType } from '../types/alertType'
import router from 'next/router'

export const putSearchKeyword = (keyword: string, type: number, searchBy:number) => (dispatch: Dispatch<ISearchType | IAlertType>) => {
    dispatch({ type: ALERT, payload: { loading: true } })
    dispatch({type: SEARCH, payload: {keyword: keyword, searchBy: searchBy, type: type}});
    if(keyword.length > 0) {
        if(type === 0) {
            if(searchBy===0) router.push(`/search/set/title?search_query=${keyword}`); 
            if(searchBy===1) router.push(`/search/set/tag?search_query=${keyword}`); 
        } else if(type === 1) 
            router.push(`/search/user/title?search_query=${keyword}`); 
        else 
            router.push(`/search/room/title?search_query=${keyword}`); 
    }
        
    dispatch({ type: ALERT, payload: { loading: false } });
}