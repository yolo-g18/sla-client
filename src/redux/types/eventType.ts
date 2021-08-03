import {  IEventRes } from "../../utils/TypeScript";

export const EVENT = 'EVENT'

export interface IEventType {
    type: typeof EVENT
    payload: IEventRes[]
}