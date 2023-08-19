import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./userSlice";
import postsReducer from "./postsSlice";
import postsSlice from "./postsSlice";

const persistConfig = { key: "root", storage, version: 1 };
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedPostsReducer = persistReducer(persistConfig, postsReducer);

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        posts: persistedPostsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
});