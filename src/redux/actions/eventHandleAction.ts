import { Dispatch } from 'redux'
import { IEventHandle } from "../../utils/TypeScript";
import { IAlertType } from "../types/alertType";
import { EVENT_HANDLE, IEventHandleType } from "../types/eventHandleType";

export const eventHandleDispatch = (eventHandle: IEventHandle) => (dispatch: Dispatch<IEventHandleType | IAlertType>) => {
    dispatch({ type: EVENT_HANDLE, payload: eventHandle });
  
  }