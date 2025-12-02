import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  CONNECTION_TYPE,
  HLR_FUR,
  CONSTANT,
  SIM_CATEGORY,
  SIM_MANUFACTURER,
  SIM_TYPE,
} from '../../../pages/appConfigPage/SimManagementTableFormUI/configTitleConstant.js';
import {
  flattenObject,
  getParentTableHeader_ForSimOrders,
  getVisibleHeaderColumnList,
} from '../../../pages/sim-management-utils/sim-management-utils.js';
import {
  createSimOrder,
  editSimHLR,
  editSimOrder,
  getHLRBatchMapping,
  getHLRBatchNumberRange,
  getHLRImsiNumberRange,
  getHLRSerialNumberRange,
  getSimCategories,
  getSimConnectionTypes,
  getSimConstantConfig,
  getSimHRL,
  getSimManufacturers,
  getSimOrderData,
  getSimPrefixes,
  getSimTypes,
  simOrderSearch,
} from '../../../services/ApiService';
import { createAppSlice } from '../../app/createAppSlice';
import { provideSimCategoryFormConfig } from '../../../pages/formTemplate/appConfigForm/simCategoryFormTemplate.js';
import { provideConnectionTypeFormConfig } from '../../../pages/formTemplate/appConfigForm/connectionTypeFormTemplate.js';
import { provideHlrFormConfig } from '../../../pages/formTemplate/appConfigForm/hlrConfigFormTemplate.js';
import { provideSimManufacturerFormConfig } from '../../../pages/formTemplate/appConfigForm/simManufacturerFormTemplate.js';
import { provideSimTypeFormConfig } from '../../../pages/formTemplate/appConfigForm/simTypeFormTemplate.js';
import { provideOtherFormConfig } from '../../../pages/formTemplate/appConfigForm/otherConfigsFormTemplate.js';
import {
  CREATE_BASIC_SIM_ORDER,
  ADD_HLR_DETAILS,
  ADD_UDCHLR_DETAILS,
} from '../../../pages/sim-components/addNewSimOrderUI/stepperUIs/stepperTitles.js';
import {
  HLR_BATCH_NUMBER_RANGE,
  HLR_IMSI_NUMBER_RANGE,
  HLR_SERIAL_NUMBER_RANGE,
} from '../../../pages/rangeSettingPage/RangeSettingTableFormUI/rangeTabConstant.js';
import { provideSerialNbRangeFormConfig } from '../../../pages/formTemplate/rangeNumberForm/hlrSerialNbRangeFormTemplate.js';
import { provideHlrBatchRangeFormConfig } from '../../../pages/formTemplate/rangeNumberForm/hlrBatchRangeFormTemplate.js';
import { provideImsiRangeFormConfig } from '../../../pages/formTemplate/rangeNumberForm/hlrImsiNbRangeFormTemplate.js';
import { provideBasicOrderFormConfig } from '../../../pages/formTemplate/simOrderForm/basicOrderFormTemplate.js';
import { provideUdcHlrRequestFormConfig } from '../../../pages/formTemplate/simOrderForm/udcHlrRequestFormTemplate.js';
import { provideHlrRequestFormConfig } from '../../../pages/formTemplate/simOrderForm/hlrRequestFormTemplate.js';

const initialState = {
  simConfigData: {
    allSimCategories: [],
    allSimManufacturers: [],
    allSimPrefixes: [],
    allSimConnectionTypes: [],
    allSimTypes: [],
    allSimHLR: [],
    otherConfigData: [],
  },

  simHlrMappingData: {
    allHLRBatchMapping: [],
  },

  simHlrRangeData: {
    allSerialNumberRange: [],
    allBatchNumberRange: [],
    allImsiNumberRange: [],
  },

  simOrder: {},

  simManagementTableFormConfig: {
    configTitle: '',
    showTableView: true,
    tableViewConfig: {},
    formViewConfig: {},
  },

  simOrderGlobalData: {
    allSimOrderData: [],
    createSimLoading: false,
    searchLoading: false,
    updateLoading: false,
    simDataLoading: false,
    message: '',
    errMessage: '',
    simOrderTable: {
      mainTableHeader: null,
      mainTableVisibleHeader: null,
    },
  },

  createNewSimOrderFormData: {
    basicSimOrderData: {},
    hlrRequestSampleData: {},
    requestMappingData: [],
  },
};

export const simManagementDataSlice = createAppSlice({
  name: 'simManagementDataSlice',
  initialState,
  reducers: {
    setparentTableHeaderElement: (state, action) => {
      state.simOrderGlobalData.simOrderTable.mainTableHeader = action.payload;
    },
    setMainTableVisibleHeader: (state, action) => {
      state.simOrderGlobalData.simOrderTable.mainTableVisibleHeader =
        action.payload;
    },
    setSimSearchLoading: (state, action) => {
      state.searchLoading = action.payload;
    },
    setcreateSimLoading: (state, action) => {
      state.createSimLoading = action.payload;
    },
    setMessageEmpty: (state) => {
      state.simOrderGlobalData.message = '';
    },
    setSimManagementTableConfigUI: (state, action) => {
      // console.log(action.payload.tableViewConfig);
      state.simManagementTableFormConfig.tableViewConfig =
        action.payload.tableViewConfig;
    },
    setShowTableView: (state, action) => {
      state.simManagementTableFormConfig.showTableView = action.payload;
    },
    setConfigTitle: (state, action) => {
      state.simManagementTableFormConfig.configTitle = action.payload;
    },
    setFormViewConfig: (state, action) => {
      state.simManagementTableFormConfig.formViewConfig = action.payload;
    },
    setIsAddForm: (state, action) => {
      const currentState = state.simManagementTableFormConfig.formViewConfig;
      const updateFormStatus = { ...currentState, isAddForm: action.payload };
      state.simManagementTableFormConfig.formViewConfig = updateFormStatus;
    },
    setBasicOrderData: (state, action) => {
      state.createNewSimOrderFormData.basicSimOrderData = action.payload;
    },
    setHlrRequestSampleData: (state, action) => {
      state.createNewSimOrderFormData.hlrRequestSampleData = action.payload;
    },
    setRequestMappingData: (state, action) => {
      state.createNewSimOrderFormData.requestMappingData = action.payload;
    },
    setResetCreateSimOrderData: (state) => {
      state.createNewSimOrderFormData = {
        basicSimOrderData: {},
        hlrRequestSampleData: {},
        requestMappingData: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrderData.fulfilled, (state, action) => {
        // console.log(action.payload.data);
        // console.log(action.payload);
        let allTableData = [];

        if (action.payload?.data?.length == 0) {
          allTableData = [];
        } else {
          allTableData = action.payload;
        }

        allTableData.forEach((item) => {
          delete item.allBatchMapping;
          delete item.initialRequest;
        });

        state.simOrderGlobalData.allSimOrderData = allTableData;

        const singleSimOrderObject = flattenObject(allTableData[0]);

        const mainTableHeader =
          getParentTableHeader_ForSimOrders(singleSimOrderObject);
        const mainTableVisibleHeader =
          getVisibleHeaderColumnList(mainTableHeader);

        state.simOrderGlobalData.simOrderTable.mainTableHeader =
          mainTableHeader;
        state.simOrderGlobalData.simOrderTable.mainTableVisibleHeader =
          mainTableVisibleHeader;
      })
      .addCase(postSimOrder.fulfilled, (state, action) => {
        if (action.payload.code == 200) {
          state.simOrderGlobalData.message = action.payload.desc;
        }
      })
      .addCase(fetchAllOrderData.rejected, (state, action) => {
        const payload = (action.payload = []);
        state.simOrderGlobalData.simOrderTable.mainTableHeader = payload;
      })
      .addCase(fetchAllSimCategory.fulfilled, (state, action) => {
        state.simConfigData.allSimCategories = action.payload;
      })
      .addCase(fetchAllSimCategory.rejected, (state) => {
        state.simConfigData.allSimCategories = [];
      })
      .addCase(fetchAllSimConnectionTypes.fulfilled, (state, action) => {
        state.simConfigData.allSimConnectionTypes = action.payload;
      })
      .addCase(fetchAllSimConnectionTypes.rejected, (state) => {
        state.simConfigData.allSimConnectionTypes = [];
      })
      .addCase(fetchAllSimManufacturers.fulfilled, (state, action) => {
        state.simConfigData.allSimManufacturers = action.payload;
      })
      .addCase(fetchAllSimManufacturers.rejected, (state) => {
        state.simConfigData.allSimManufacturers = [];
      })
      .addCase(fetchAllSimPrefixes.fulfilled, (state, action) => {
        state.simConfigData.allSimPrefixes = action.payload;
      })
      .addCase(fetchAllSimPrefixes.rejected, (state) => {
        state.simConfigData.allSimPrefixes = [];
      })
      .addCase(fetchAllSimTypes.fulfilled, (state, action) => {
        state.simConfigData.allSimTypes = action.payload;
      })
      .addCase(fetchAllSimTypes.rejected, (state) => {
        state.simConfigData.allSimTypes = [];
      })
      .addCase(fetchAllSimHLR.fulfilled, (state, action) => {
        state.simConfigData.allSimHLR = action.payload;
      })
      .addCase(fetchAllSimHLR.rejected, (state) => {
        state.simConfigData.allSimHLR = [];
      })
      .addCase(searchOrders.fulfilled, (state, action) => {
        if (action.payload.code == '404') {
          state.simOrderGlobalData.allSimOrderData = [];
        }
        state.simOrderGlobalData.allSimOrderData = action.payload;
      })
      .addCase(updateSimHRL.fulfilled, (state, action) => {
        state.simOrder = action.payload;
      })
      .addCase(fetchAllSerialNumberRange.fulfilled, (state, action) => {
        state.simHlrRangeData.allSerialNumberRange = action.payload;
      })
      .addCase(fetchAllSerialNumberRange.rejected, (state) => {
        state.simHlrRangeData.allSerialNumberRange = [];
      })
      .addCase(fetchAllBatchNumberRange.fulfilled, (state, action) => {
        state.simHlrRangeData.allBatchNumberRange = action.payload;
      })
      .addCase(fetchAllBatchNumberRange.rejected, (state) => {
        state.simHlrRangeData.allBatchNumberRange = [];
      })
      .addCase(fetchAllImsiNumberRange.fulfilled, (state, action) => {
        state.simHlrRangeData.allImsiNumberRange = action.payload;
      })
      .addCase(fetchAllImsiNumberRange.rejected, (state) => {
        state.simHlrRangeData.allImsiNumberRange = [];
      })
      .addCase(getAllHLRBatchMapping.fulfilled, (state, action) => {
        state.simBatchMappingData.allHLRBatchMapping = action.payload;
      })
      .addCase(getAllHLRBatchMapping.rejected, (state) => {
        state.simBatchMappingData.allHLRBatchMapping = [];
      })
      .addCase(fetchDynamicFormConfig.fulfilled, (state, action) => {
        state.simManagementTableFormConfig.formViewConfig = action.payload;
      })
      .addCase(fetchDynamicFormConfig.rejected, (state) => {
        state.simManagementTableFormConfig.formViewConfig = {};
      })
      .addCase(fetchOtherConstantConfigData.fulfilled, (state, action) => {
        state.simConfigData.otherConfigData = action.payload;
      })
      .addCase(fetchOtherConstantConfigData.rejected, (state) => {
        state.simConfigData.otherConfigData = [];
      });
  },
});

export const {
  setparentTableHeaderElement,
  setExpandToDetails,
  setMainTableVisibleHeader,
  setMessageEmpty,
  setNewsimData,
  setSimManagementTableConfigUI,
  setShowTableView,
  setConfigTitle,
  setFormViewConfig,
  setIsAddForm,
  setBasicOrderData,
  setHlrRequestSampleData,
  setRequestMappingData,
  setResetCreateSimOrderData,
} = simManagementDataSlice.actions;

export const fetchAllOrderData = createAsyncThunk(
  'simManagementDataSlice/fetchAllOrderData',
  async () => {
    try {
      return await getSimOrderData();
    } catch (error) {
      return [];
    }
  }
);

export const fetchAllSimCategory = createAsyncThunk(
  'simManagementDataSlice/fetchAllSimCategory',
  async () => {
    let allSimCategories = [];

    try {
      allSimCategories = await getSimCategories();
      return allSimCategories;
    } catch (error) {
      return [];
    }
  }
);

export const fetchAllSimConnectionTypes = createAsyncThunk(
  'simManagementDataSlice/fetchAllSimConnectionTypes',
  async () => {
    let allSimConnectionTypes = [];
    try {
      allSimConnectionTypes = await getSimConnectionTypes();
      return allSimConnectionTypes;
    } catch (error) {
      return [];
    }
  }
);

export const fetchAllSimManufacturers = createAsyncThunk(
  'simManagementDataSlice/fetchAllSimManufacturers',
  async () => {
    let allSimManufacturers = [];
    try {
      allSimManufacturers = await getSimManufacturers();
      return allSimManufacturers;
    } catch (error) {
      return [];
    }
  }
);

export const fetchAllSimPrefixes = createAsyncThunk(
  'simManagementDataSlice/fetchAllSimPrefixes',
  async () => {
    let allSimPrefixes = [];
    try {
      allSimPrefixes = await getSimPrefixes();
      // console.log(allSimPrefixes, " fetch all sim prefixes")
      return allSimPrefixes;
    } catch (error) {
      return [];
    }
  }
);

export const fetchAllSimHLR = createAsyncThunk(
  'simManagementDataSlice/fetchAllSimHLR',
  async () => {
    let allSimHLR = [];
    try {
      allSimHLR = await getSimHRL();
      return allSimHLR;
    } catch (error) {
      return [];
    }
  }
);

export const fetchAllSimTypes = createAsyncThunk(
  'simManagementDataSlice/fetchAllSimTypes',
  async () => {
    let allSimTypes = [];
    try {
      allSimTypes = await getSimTypes();
      return allSimTypes;
    } catch (error) {
      return [];
    }
  }
);

export const postSimOrder = createAsyncThunk(
  'simManagementDataSlice/postSimOrder',
  async (params) => {
    const {
      simCategory,
      comments,
      connectionType,
      manufacturer,
      id,
      partCode,
      simPrefix,
      quantity,
      simType,
      createdBy,
      status,
      data,
      purchaseOrder,
      kitNumber,
      serialNumber,
    } = params;

    try {
      const result = await createSimOrder({
        simCategory,
        comments,
        connectionType,
        manufacturer,
        id,
        partCode,
        simPrefix,
        quantity,
        simType,
        purchaseOrder,
        status,
        createdBy,
        data,
        kitNumber,
        serialNumber,
      });

      return result;
    } catch (error) {
      return [];
    }
  }
);

export const searchOrders = createAsyncThunk(
  'simManagementDataSlice/searchOrders',
  async (params) => {
    let searchResult = [];
    const { fieldName, fieldValue } = params;
    try {
      searchResult = await simOrderSearch(fieldName, fieldValue);
      return searchResult;
    } catch (error) {
      return [];
    }
  }
);


export const updateSimHRL = createAsyncThunk(
  'simManagementDataSlice/updateSimHRL',
  async (params) => {
    const {
      id,
      graphKey,
      quantity,
      electricProfile,
      transportKey,
      hlr,
      expirtyDate,
    } = params;
    try {
      const result = await editSimHLR({
        id,
        graphKey,
        quantity,
        electricProfile,
        transportKey,
        hlr,
        expirtyDate,
      });
      return result;
    } catch (error) {
      return [];
    }
  }
);

export const getAllHLRBatchMapping = createAsyncThunk(
  'simManagementDataSlice/getHLRBatchMapping',
  async () => {
    let allHLRBatchMapping = [];
    try {
      allHLRBatchMapping = await getHLRBatchMapping();
      return allHLRBatchMapping;
    } catch (error) {
      return [];
    }
  }
);

export const fetchAllSerialNumberRange = createAsyncThunk(
  'simManagementDataSlice/fetchAllSerialNumber',
  async () => {
    let data = [];
    try {
      data = await getHLRSerialNumberRange();
      return data;
    } catch (error) {
      return [];
    }
  }
);

export const fetchAllBatchNumberRange = createAsyncThunk(
  'simManagementDataSlice/fetchAllBatchNumberRange',
  async () => {
    let data = [];
    try {
      data = await getHLRBatchNumberRange();
      return data;
    } catch (error) {
      return [];
    }
  }
);

export const fetchAllImsiNumberRange = createAsyncThunk(
  'simManagementDataSlice/fetchAllImsiNumberRange',
  async () => {
    let data = [];
    try {
      data = await getHLRImsiNumberRange();
      return data;
    } catch (error) {
      return [];
    }
  }
);

export const fetchOtherConstantConfigData = createAsyncThunk(
  'simManagementDataSlice/fetchOtherConstantConfigData',
  async () => {
    let data = [];
    try {
      data = await getSimConstantConfig();
      return data;
    } catch (error) {
      return [];
    }
  }
);

export const fetchDynamicFormConfig = createAsyncThunk(
  'simManagementDataSlice/fetchDynamicFormConfig',
  async (formTitle) => {
    const fetchConfigData = async (formConfigFn = async () => {}) => {
      let data = [];
      try {
        data = await formConfigFn();
        // console.log(data);
        return data;
      } catch (error) {
        return [];
      }
    };

    switch (formTitle) {
      case SIM_TYPE:
        return await fetchConfigData(provideSimTypeFormConfig);
      case CONNECTION_TYPE:
        return await fetchConfigData(provideConnectionTypeFormConfig);
      case HLR_FUR:
        return await fetchConfigData(provideHlrFormConfig);
      case SIM_CATEGORY:
        return await fetchConfigData(provideSimCategoryFormConfig);
      case SIM_MANUFACTURER:
        return await fetchConfigData(provideSimManufacturerFormConfig);
      // case SIM_PREFIX:
      //   return await fetchConfigData(provideSimPrefixFormConfig);
      case CONSTANT:
        return await fetchConfigData(provideOtherFormConfig);

      // Range setting config
      case HLR_SERIAL_NUMBER_RANGE:
        return await fetchConfigData(provideSerialNbRangeFormConfig);
      case HLR_BATCH_NUMBER_RANGE:
        return await fetchConfigData(provideHlrBatchRangeFormConfig);
      case HLR_IMSI_NUMBER_RANGE:
        return await fetchConfigData(provideImsiRangeFormConfig);

      // add new sim order with hlr setting
      case CREATE_BASIC_SIM_ORDER:
        return await fetchConfigData(provideBasicOrderFormConfig);
      case ADD_HLR_DETAILS:
        return await fetchConfigData(provideHlrRequestFormConfig);
      case ADD_UDCHLR_DETAILS:
        return await fetchConfigData(provideUdcHlrRequestFormConfig);

      // Other configuration
    }
  }
);
