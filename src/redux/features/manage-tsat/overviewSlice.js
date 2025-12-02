import { createAsyncThunk } from '@reduxjs/toolkit';

import { getTableHeader_ForTsatOverview } from '../../../pages/tsat/tsat-utils/tsat-utils';
import {
  fetchMsisdnConfigData,
  fetchTSATMasterData,
  getCsOfferFormMasterSchema,
  getCsOfferMasterData,
  getCsSearchContent,
  getOfferOverviewData,
  getTableBodyForTableView,
} from '../../../services/ApiService';
import { createAppSlice } from '../../app/createAppSlice';

const initialState = {
  searchValue: null,
  displayNav: false,
  noData: false,
  offerids: [],
  overviewData: {},
  allMasterData: {},
  allFormSchema: {},
  tsatMasterData: {},
  masterDataLoaded: false,
  msisdnCardConfig: {},
  msisdnConfigData: {},
  mainTableHeader: [],
  tableBodyData: [],
};

export const overViewSlice = createAppSlice({
  name: 'overViewSlice',
  initialState,
  reducers: {
    setSearchValueUpdate: (state, action) => {
      state.searchValue = action.payload;
    },
    setDisplayNav: (state, action) => {
      state.displayNav = action.payload;
    },
    clearSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCsOfferMasterData.fulfilled, (state, action) => {
        if (action.payload) {
          state.allMasterData = action.payload;
        } else {
          state.allMasterData = {};
        }
      })
      .addCase(fetchCsOfferFormMasterSchema.fulfilled, (state, action) => {
        if (action.payload) {
          state.allFormSchema = action.payload;
        } else {
          state.allFormSchema = {};
        }
      })
      .addCase(fetchSearchContent.fulfilled, (state, action) => {
        if (action.payload) {
          state.searchValue = action.payload;
          state.noData = false;
          state.displayNav = true;
        } else {
          state.searchValue = null;
          state.noData = true;
          state.displayNav = false;
        }
      })
      .addCase(fetchTsatMasterData.fulfilled, (state, action) => {
        if (action.payload) {
          state.tsatMasterData = action.payload;
          state.masterDataLoaded = true;
          state.displayNav = false;
        } else {
          state.masterDataLoaded = false;
        }
      })
      .addCase(getMsisdnConfigData.fulfilled, (state, action) => {
        if (action.payload) {
          state.msisdnConfigData = action.payload;
        }
      })
      .addCase(fetchOfferOverviewData.fulfilled, (state, action) => {
        const data = Object.keys(action.payload);
        // console.log(data, " the overview data")
        // if (data.length > 0) {
        //   state.overviewData = action.payload;
        //   // state.noData = false;
        // } else {
        //   state.noData = true;
        // }
      })
      .addCase(fetchConfigDataAndTableData.fulfilled, (state, action) => {
        if (action.payload) {
          state.msisdnConfigData = action.payload.msisdnConfigData;

          state.mainTableHeader = action.payload.overviewTableHeaderData;
          state.tableBodyData = action.payload.overviewTableBodyData;
        }
      });
  },
});

export const { setSearchValueUpdate, setDisplayNav, clearSearchValue } =
  overViewSlice.actions;

export const fetchCsOfferMasterData = createAsyncThunk(
  'overViewSlice/fetchCsOfferMasterData',
  async (params, thunkApi) => {
    try {
      const data = await getCsOfferMasterData();
      return data;
    } catch (error) {
      return false;
    }
  }
);

export const fetchCsOfferFormMasterSchema = createAsyncThunk(
  'overViewSlice/fetchCsOfferFormMasterSchema',
  async (_, thunkApi) => {
    try {
      const data = await getCsOfferFormMasterSchema();
      return data;
    } catch (error) {
      return false;
    }
  }
);

export const fetchSearchContent = createAsyncThunk(
  'overViewSlice/fetchSearchContent',
  async (searchId, thunkApi) => {
    try {
      const data = await getCsSearchContent(searchId);

      return data;
    } catch (error) {
      return false;
    }
  }
);

export const fetchTsatMasterData = createAsyncThunk(
  'overViewSlice/fetchTsatMasterData',
  async (_, thunkApi) => {
    try {
      const data = await fetchTSATMasterData();
      return data;
    } catch (error) {
      return false;
    }
  }
);

export const getMsisdnConfigData = createAsyncThunk(
  'overViewSlice/getMsisdnConfigData',
  async (code, thunkApi) => {
    try {
      const data = await fetchMsisdnConfigData(code);
      return data;
    } catch (error) {
      return false;
    }
  }
);

export const fetchOfferOverviewData = createAsyncThunk(
  'overviewSlice/fetchOfferOverviewData',
  async (_, thunkApi) => {
    try {
      const data = await getOfferOverviewData();
      return data;
    } catch (error) {
      return false;
    }
  }
);

export const fetchConfigDataAndTableData = createAsyncThunk(
  'overViewSlice/fetchConfigDataAndTableData',
  async (code) => {
    try {
      const msisdnConfigData = await fetchMsisdnConfigData(code);
      const overviewTableHeaderData = getTableHeader_ForTsatOverview(
        msisdnConfigData?.columns
      );
      const tableBodyDataFormDB = await getTableBodyForTableView(
        msisdnConfigData?.url
      );
      const overviewTableBodyData = tableBodyDataFormDB.map((row) => {
        delete row?._id;
        return row;
      });

      return {
        msisdnConfigData,
        overviewTableHeaderData,
        overviewTableBodyData,
      };
    } catch (error) {
      return false;
    }
  }
);
