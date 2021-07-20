import { ISearch } from "../../utils/TypeScript";

export const SEARCH = 'SEARCH'

export interface ISearchType {
    type: typeof SEARCH
    payload: ISearch
}