import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";
import productReducer from "./Reducers/productReducer";
import {chatReducer} from "./Reducers/chatReducer";

const rootReducers = {
    auth:authReducer,
    category:categoryReducer,
    product:productReducer,
    chat:chatReducer
};

export default rootReducers;