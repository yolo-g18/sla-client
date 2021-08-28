import { IEventHandle } from "../../utils/TypeScript";


export const EVENT_HANDLE = 'EVENT_HANDLE' 

export interface IEventHandleType { 
    type: typeof EVENT_HANDLE
    payload: IEventHandle
}