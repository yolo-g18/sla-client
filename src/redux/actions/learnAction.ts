import { ILearnActionPayload } from "../../utils/TypeScript";
import { Dispatch } from 'redux'
import { IAlertType } from "../types/alertType";
import { ILearnType, LEARN_TYPE } from "../types/learnType";

export const learnByDay = (learnByDayPayload: ILearnActionPayload) => (dispatch: Dispatch<ILearnType | IAlertType>) => {
    dispatch({ type: LEARN_TYPE, payload: learnByDayPayload });
  
  }