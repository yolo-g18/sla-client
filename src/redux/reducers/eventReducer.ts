import {  IEventRes } from "../../utils/TypeScript";
import { EVENT_HANDLE } from "../types/eventHandleType";
import {IEventType, EVENT} from '../types/eventType';

const eventReducer = (state: IEventRes[] = [], action: IEventType): IEventRes[] => {
    switch (action.type){
      case EVENT:
        return action.payload
      default:
        return state
    }
  }
  
  export default eventReducer;