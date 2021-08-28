import { ILearnActionPayload } from "../../utils/TypeScript";


export const LEARN_TYPE = 'LEARN_TYPE';

export interface ILearnType {
    type: typeof LEARN_TYPE
    payload: ILearnActionPayload
}