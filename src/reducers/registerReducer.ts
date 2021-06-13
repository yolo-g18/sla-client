import * as types from "../actions";

export default function(state = [], action: any) {
    let response = action.response;

    switch(action.types) {
        case types.REGISTER_USER_SUCCESS:
            return { ...state, response};
        case types.REGISTER_USER_ERROR:
            return { ...state, response};
        default:
            return state;
    }
}