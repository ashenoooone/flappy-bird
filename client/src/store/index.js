import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/UserSlice';
import shopReducer from './slices/ShopSlice'
import adminReducer from './slices/AdminSlice'
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from "redux-persist";

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['admin']
}

const rootReducer = combineReducers({
	user: userReducer,
	shop: shopReducer,
	admin: adminReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
})


export const persistor = persistStore(store);