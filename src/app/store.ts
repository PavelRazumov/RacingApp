import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { driverReducer } from '../featute/Drivers/slice/driverSlice.ts';
import { driverDetailsReducer } from '../featute/DriverDetail/slice/driverDetailsSlice.ts';
import { racesSliceReducer } from '../featute/Races/slice/racesSlice.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['racesSliceReducer', 'driverDetailsReducer', 'driverReducer'],
};

const rootReducer = combineReducers({ driverReducer, driverDetailsReducer, racesSliceReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
