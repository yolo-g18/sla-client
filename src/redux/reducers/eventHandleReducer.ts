import {  IEventHandle, IEventRes } from "../../utils/TypeScript";
import { EVENT_HANDLE, IEventHandleType } from "../types/eventHandleType";

const eventHandleReducer = (state: IEventHandle = {}, action: IEventHandleType): IEventHandle => {
    switch (action.type){
      case EVENT_HANDLE:
        return action.payload
      default:
        return state
    }
  }
  
  export default eventHandleReducer;