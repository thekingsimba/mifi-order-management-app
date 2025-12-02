import {
  getSimHRL,
  getSimManufacturers,
} from '../../../services/ApiService';

const hlrFurList = async () => {
  try {
    const response = await getSimHRL();
    return response.map((item) => {
      return { selectItem: item.hlrCode, itemValue: item.hlrCode };
    });
  } catch (error) {
    return [];
  }
};

const getSimManufacturersList = async () => {
  try {
    const response = await getSimManufacturers();
    return response.map((item) => {
      return { selectItem: item.name, itemValue: item.name };
    });
  } catch (error) {
    return [];
  }
};

export const basicOrder_form_config = {};

export const provideBasicOrderFormConfig = async () => {
  return {
    inputConfig: [
      {
        label: 'Purchase Order',
        type: 'text',
        name: 'purchaseOrder',
        value: '',
        placeholder: 'NG-OR-3446',
        required: true,
        errorMessage: 'Invalid input.',
      },
      {
        label: 'FUR/UDC',
        type: 'select',
        name: 'hlrFur',
        possibleSelectValue: await hlrFurList(),
        required: true,
      },
      {
        label: 'Sim Total Quantity',
        name: 'simTotalQuantity',
        value: '',
        type: 'text',
        placeholder: '50000',
        required: true,
        errorMessage: 'Invalid input.',
      },
      // {
      //   label: 'Sim Category',
      //   type: 'select',
      //   name: 'simCategory',
      //   required: true,
      //   possibleSelectValue: await simCategoriesList(),
      // },
      {
        label: 'Sim Manufacturer',
        type: 'select',
        name: 'simManufacturer',
        required: true,
        possibleSelectValue: await getSimManufacturersList(),
      },
      // {
      //   label: 'SIM Type',
      //   type: 'select',
      //   name: 'simType',
      //   required: true,
      //   possibleSelectValue: await simTypeList(),
      // },
      {
        label: 'Comments',
        name: 'comments',
        value: '',
        type: 'textarea',
        placeholder: 'LAGOS',
        errorMessage: 'Invalid input.',
      },
    ],
    uiColumn: 3,
    isAddForm: true,
  };
};

export const basicOrder_Form_submitMethod = {
  isAddForm: async (formData) => {
    console.log(formData, 'basicOrder isAddForm');
  },
  isEditForm: async (formData) => {
    console.log(formData, 'basicOrder isEditForm');
  },
};
