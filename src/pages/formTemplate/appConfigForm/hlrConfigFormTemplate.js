import {
  createSimHRLConfig,
  getHLRSequenceId,
  updateSimHRLConfig,
} from '../../../services/ApiService';
import { formatToDecimal } from '../../sim-management-utils/sim-management-utils';

export const hlr_config_form = {};

export const provideHlrFormConfig = () => {
  return {
    inputConfig: [
      {
        label: 'HLR Code',
        type: 'text',
        name: 'hlrCode',
        value: '',
        placeholder: 'FUR1',
        required: true,
        // regexPattern: '^[A-Za-z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'Graph Profile',
        type: 'number',
        name: 'graphProfile',
        value: 0,
        placeholder: '10000',
        required: true,
        // regexPattern: '^[A-Za-z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'Electric Profile',
        type: 'number',
        name: 'electricProfile',
        value: 0,
        placeholder: '10000',
        required: true,
        // regexPattern: '^[A-Za-z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'FUR FLAG',
        name: 'fur',
        value: '',
        type: 'text',
        placeholder: 'FUR1',
        required: true,
        // regexPattern: '^[a-zA-Z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'FUR Code',
        type: 'text',
        name: 'furCode',
        value: '',
        placeholder: '1',
        required: true,
        // regexPattern: '^[A-Za-z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'HLR related Sim Type',
        name: 'hlrSimType',
        type: 'select',
        value: '',
        placeholder: 'PPWB',
        required: true,
        // regexPattern: '^[a-zA-Z ]+$',
        errorMessage: 'Invalid input.',
        possibleSelectValue: [
          { selectItem: 'PPWB', itemValue: 'PPWB' },
          { selectItem: 'PPDSA', itemValue: 'PPDSA' },
        ],
      },
      {
        label: 'HLR related Sim Category',
        name: 'hlrSimCategory',
        type: 'select',
        value: '',
        placeholder: 'PPWBT',
        required: true,
        // regexPattern: '^[a-zA-Z ]+$',
        errorMessage: 'Invalid input.',
        possibleSelectValue: [
          { selectItem: 'PPWBT', itemValue: 'PPWBT' },
          { selectItem: 'TDSA', itemValue: 'TDSA' },
        ],
      },
    ],
    uiColumn: 2,
    isAddForm: true,
  };
};

export const hlr_config_submitMethod = {
  isAddForm: async (formData) => {
    const sequenceId = await getHLRSequenceId();
    if (sequenceId && sequenceId.sequence_value) {
      formData['seq_id'] = sequenceId.sequence_value.toString();
    }

    formData['electricProfile'] = formatToDecimal(formData['electricProfile']);
    formData['graphProfile'] = formatToDecimal(formData['graphProfile']);

    // console.log(formData);
    return await createSimHRLConfig(formData);
  },
  isEditForm: async (formData) => {
    // console.log(formData);

    const { seq_id } = formData;
    delete formData.seq_id;
    delete formData._id;

    formData['electricProfile'] = formatToDecimal(formData['electricProfile']);
    formData['graphProfile'] = formatToDecimal(formData['graphProfile']);

    return await updateSimHRLConfig(formData, seq_id);
  },
};
