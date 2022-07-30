import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/user";
import cmsReducer from "./slice/cms";

export default configureStore({
  reducer: {
    user: userReducer,
    cms: cmsReducer,
  },
});
