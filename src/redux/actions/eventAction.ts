import { Dispatch } from "redux";
import {  IAlertType } from "../types/alertType";

import { EVENT, IEventType } from "../types/eventType";
import {  IEventRes } from "../../utils/TypeScript";

export const putEvent =
  (eventList: IEventRes[]) => (dispatch: Dispatch<IEventType | IAlertType>) => {
    dispatch({ type: EVENT, payload: eventList });
  };


