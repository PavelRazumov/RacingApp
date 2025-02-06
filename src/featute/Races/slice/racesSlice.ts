import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { clientApi } from '../../../api/clientApi';
import { RootState } from '../../../app/store.ts';
import { LIMIT } from '../../Drivers/slice/contants.ts';
import { RACE_LIMIT } from './constants.ts';

export interface RaceModel {
    date: string;
    raceName: string;
    round: string;
    season: string;
}

interface RacesStateModel {
    races: RaceModel[];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: RacesStateModel = {
    races: [],
    status: 'idle',
};

export interface RacesRequestModel {
    id: string;
    page: number;
}

export const fetchRacesThunk = createAsyncThunk<RaceModel[], RacesRequestModel>(
    'racesSlice/fetch',
    async ({ id, page }) => {
        console.log('fetchRacesThunk! - ', { id, page });

        const response = await clientApi.get(`/drivers/${id}/races.json`, {
            params: {
                limit: RACE_LIMIT,
                offset: page,
            },
        });
        const races = response.data['MRData']?.['RaceTable']?.['Races'] || [];

        return races;
    },
);
export const racesSlice = createSlice({
    name: 'racesSlice',
    initialState,
    reducers: {
        clearRace: (state) => {
            state.races = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRacesThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRacesThunk.fulfilled, (state, action) => {
                state.status = 'idle';
                state.races = [...state.races, ...action.payload];
            });
    },
});

export const { clearRace } = racesSlice.actions;
export const racesSliceReducer = racesSlice.reducer;

export const selectRaces = (state: RootState) => state.racesSliceReducer.races;
export const selectRacesLoading = (state: RootState): boolean => state.racesSliceReducer.status === 'loading';
