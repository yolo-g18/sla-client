import { takeLatest } from "redux-saga/effects";
import { registerSaga } from "./authenticationSaga";

import * as types from "../actions";
import { Action } from "redux";

export default function* watchUserAuthentication() {
    yield takeLatest<any>(types.REGISTER_USER, registerSaga);
}