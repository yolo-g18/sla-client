import { ILearnActionPayload } from "../../utils/TypeScript";
import { ILearnType } from "../types/learnType";

const learnReducer = (state: ILearnActionPayload = {}, action: ILearnType): ILearnActionPayload => {
    switch (action.type) {
        case "LEARN_TYPE":
            return action.payload
        default:
            return state
    }
}

export default learnReducer