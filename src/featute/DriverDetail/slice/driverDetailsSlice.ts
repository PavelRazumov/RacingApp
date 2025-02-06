import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { clientApi } from '../../../api/clientApi';
import { RootState } from '../../../app/store.ts';

interface DriverInfoModel {
    code: string;
    dateOfBirth: string;
    driverId: string;
    familyName: string;
    givenName: string;
    nationality: string;
}

interface DriverDetailsStateModel {
    driverInfo: DriverInfoModel | undefined;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: DriverDetailsStateModel = {
    driverInfo: undefined,
    status: 'idle',
};

export const fetchDriverDetailsThunk = createAsyncThunk('driverDetailsSlice/fetch', async (id: string) => {
    const response = await clientApi.get(`/drivers/${id}.json`);
    const drivers = response.data['MRData']?.['DriverTable']?.['Drivers'] || [];

    return drivers?.[0];
});
export const driverDetailsSlice = createSlice({
    name: 'driverDeatilsSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDriverDetailsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDriverDetailsThunk.fulfilled, (state, action) => {
                state.status = 'idle';

                console.log('Fillfil');
                state.driverInfo = action.payload;
            });
    },
});

export const driverDetailsReducer = driverDetailsSlice.reducer;

export const selectDriver = (state: RootState): DriverInfoModel | undefined => state.driverDetailsReducer.driverInfo;
export const selectDriverDetailsLoading = (state: RootState): boolean =>
    state.driverDetailsReducer.status === 'loading';
