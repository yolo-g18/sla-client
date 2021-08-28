import { ISearch } from '../../utils/TypeScript';
import { ISearchType, SEARCH } from '../types/searchType';


const searchReducer = (state: ISearch = {}, action: ISearchType): ISearch => {
  switch (action.type){
    case SEARCH:
      return action.payload
    default:
      return state
  }
}

export default searchReducer;