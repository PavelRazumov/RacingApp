import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { clientApi } from '../../../api/clientApi';
import { RootState } from '../../../app/store.ts';
import { LIMIT } from './contants.ts';

interface DriverStateModel {
    drivers: [];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: DriverStateModel = {
    drivers: [],
    status: 'idle',
};

export const fetchDriversThunk = createAsyncThunk('driverSlice/fetch', async (offset: number) => {
    const response = await clientApi.get('/drivers.json', {
        params: {
            limit: LIMIT,
            offset: offset,
        },
    });
    const drivers = response.data['MRData']?.['DriverTable']?.['Drivers'] || [];

    return drivers;
});
export const driverSlice = createSlice({
    name: 'driverSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDriversThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDriversThunk.fulfilled, (state, action) => {
                state.status = 'idle';
                state.drivers = [...state.drivers, ...action.payload];
            });
    },
});

export const driverReducer = driverSlice.reducer;

export const selectDrivers = (state: RootState) => state.driverReducer.drivers;
export const selectDriversLoading = (state: RootState): boolean => state.driverReducer.status === 'loading';
