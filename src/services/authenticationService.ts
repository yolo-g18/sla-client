import axios from "axios";

import { PARAMS } from "../common/params"

//register service
export const registerUserService = (request: any) => {
    const REGISTER_API_ENDPOINT = PARAMS.ENDPOINT + "auth/register";

    const parameter = {
        method: "POST",
        headers: {
            "Content-Type": "app;ication.json"
        },
        body: JSON.stringify(request.user)
    }

    return fetch(REGISTER_API_ENDPOINT, parameter)
        .then(response => {
            return response.json();
        })
        .then(json => {
            return json;
        });
}