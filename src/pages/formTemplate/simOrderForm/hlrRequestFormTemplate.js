import { E_SIM, PHYSICAL_SIM } from '../../SimOrdersPage/simOrderConstant';

export const hlrRequest_form_config = {};

export const provideHlrRequestFormConfig = () => {
  return {
    inputConfig: [
      {
        label: 'electric Profile',
        type: 'text',
        name: 'electricProfile',
        value: '',
        disable: true,
      },
      {
        label: 'Transport Key',
        type: 'number',
        name: 'transportKey',
        value: 0,
        placeholder: '4 or 5',
        required: true,
        // regexPattern: '^[A-Za-z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'HLR Quantity',
        type: 'number',
        name: 'hlrQuantity',
        disable: true,
        value: 0,
        placeholder: '10000',
        // regexPattern: '^[A-Za-z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'Resource Type',
        type: 'select',
        name: 'resourceType',
        placeholder: 'E-SIM or Physical SIM',
        required: true,
        possibleSelectValue: [
          { selectItem: E_SIM, itemValue: E_SIM },
          { selectItem: PHYSICAL_SIM, itemValue: PHYSICAL_SIM },
        ],
      },
      {
        label: 'Graph Profile',
        type: 'text',
        name: 'graphProfile',
        value: '',
        disable: true,
      },
    ],
    uiColumn: 3,
    isAddForm: true,
  };
};

export const hlrRequest_Form_submitMethod = {
  isAddForm: async (formData) => {
    console.log(formData, 'hlrRequest isAddForm');
  },
  isEditForm: async (formData) => {
    console.log(formData, 'hlrRequest isEditForm');
  },
};
