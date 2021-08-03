import { Dispatch } from "redux";
import { EVENT, IEventType } from "../types/EventType";
import { ALERT, IAlertType } from "../types/alertType";
import { IEventRes } from "../../utils/TypeScript";

export const putEvent =
  (eventList: IEventRes[]) => (dispatch: Dispatch<IEventType | IAlertType>) => {
    dispatch({ type: EVENT, payload: eventList });
  };
