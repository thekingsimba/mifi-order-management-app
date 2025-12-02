import { createAsyncThunk } from '@reduxjs/toolkit';

import { handleApiFunc } from 'src/pages/sim-management-pages/preActivation/service/api';

import { createAppSlice } from '../app/createAppSlice';
import _ from 'lodash';

const initialState = {
    backOfficeMasterData: {},
    isLoading: false,
};

export const simPreActivationSlice = createAppSlice({
    name: 'simPreActivationSlice',
    initialState,
    reducers: {
        setSearchValueUpdate: (state, action) => {
            state.searchValue = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchBackOfficeOfferMasterData.fulfilled, (state, action) => {
                if (action.payload) {
                    state.backOfficeMasterData = action.payload;
                    state.isLoading = true
                } else {
                    state.backOfficeMasterData = {};
                    state.isLoading = false
                }
            })
    },
});

export const { setSearchValueUpdate } =
    simPreActivationSlice.actions;


export const fetchBackOfficeOfferMasterData = createAsyncThunk(
    'simPreActivationSlice/fetchBackOfficeOfferMasterData',
    async ( ) => {
        try {
                const data = await handleApiFunc({
                    path: 'dclm-bss-api',
                    method: 'GET',
                    params: 'GetBackOfficeMasterData'
                });
                return data;
        } catch (error) {
            console.log(error, '')
        }
    }
);