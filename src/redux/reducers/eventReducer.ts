import {  IEventRes } from "../../utils/TypeScript";
import {IEventType, EVENT} from '../types/EventType';

const eventReducer = (state: IEventRes[] = [], action: IEventType): IEventRes[] => {
    switch (action.type){
      case EVENT:
        return action.payload
      default:
        return state
    }
  }
  
  export default eventReducer;