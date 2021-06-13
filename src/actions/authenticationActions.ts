import * as types from "./index";

export const registerUserAction = (user: any) => {
    return {
        type: types.REGISTER_USER,
        user
    }
};