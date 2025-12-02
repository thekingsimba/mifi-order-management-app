import {
  createSimConstantConfig,
  getSimConstantConfigSequenceId,
  updateSimConstantConfig,
} from '../../../services/ApiService';

export const hlr_config_form = {};

export const provideOtherFormConfig = () => {
  return {
    inputConfig: [
      {
        label: 'Constant key',
        type: 'select',
        name: 'name',
        required: true,
        possibleSelectValue: [
          { selectItem: 'Part Code', itemValue: 'partCode' },
          { selectItem: 'Subsidiary Code', itemValue: 'subsidiaryCode' },
          { selectItem: 'Location Code', itemValue: 'locationCode' },
          { selectItem: 'Customer', itemValue: 'customer' },
          { selectItem: 'Sim Connection Type', itemValue: 'simConnectionType' },
        ],
      },
      {
        label: 'Value',
        name: 'value',
        value: '',
        type: 'text',
        placeholder: 'Enter a value',
        required: true,
        errorMessage: 'Invalid input.',
      },
    ],
    uiColumn: 2,
    isAddForm: true,
  };
};

export const other_config_submitMethod = {
  isAddForm: async (formData) => {
    const sequenceId = await getSimConstantConfigSequenceId();
    if (sequenceId && sequenceId.sequence_value) {
      formData['seq_id'] = sequenceId.sequence_value.toString();
    }
    return await createSimConstantConfig(formData);
  },
  isEditForm: async (formData) => {
    const { seq_id } = formData;
    delete formData.seq_id;
    delete formData._id;
    return await updateSimConstantConfig(formData, seq_id);
  },
};
