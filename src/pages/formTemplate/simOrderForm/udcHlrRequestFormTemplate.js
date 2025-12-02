export const hlrRequest_form_config = {};

export const provideUdcHlrRequestFormConfig = () => {
  return {
    inputConfig: [
      {
        label: 'Graph Profile',
        type: 'text',
        name: 'graphProfile',
        value: '',
        disable: true,
      },
      {
        label: 'electric Profile',
        type: 'text',
        name: 'electricProfile',
        value: '',
        disable: true,
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
        label: 'Transport Key',
        type: 'number',
        name: 'transportKey',
        value: 0,
        placeholder: '4',
        required: true,
        // regexPattern: '^[A-Za-z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'IMSI Start Number',
        type: 'text',
        name: 'imsiStartNumber',
        value: 0,
        required: true,
      },
      {
        label: 'IMSI End Number',
        type: 'text',
        name: 'imsiEndNumber',
        value: 0,
        required: true,
      },
    ],
    uiColumn: 3,
    isAddForm: true,
  };
};

export const udcHlrRequest_Form_submitMethod = {
  isAddForm: async (formData) => {
    console.log(formData, 'hlrRequest isAddForm');
  },
  isEditForm: async (formData) => {
    console.log(formData, 'hlrRequest isEditForm');
  },
};
