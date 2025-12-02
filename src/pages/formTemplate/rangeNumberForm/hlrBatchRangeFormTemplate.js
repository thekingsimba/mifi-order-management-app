import {
  createHLRBatchNumberRange,
  getHLRBatchMappingSequenceId,
  updateHLRBatchNumberRange,
} from '../../../services/ApiService';


export const hlr_batchRange_config_form = {};

export const provideHlrBatchRangeFormConfig = async () => {
  return {
    inputConfig: [
      {
        label: 'Last Batch Number Used',
        name: 'lastNumberUsed',
        type: 'number',
        placeholder: '234000000001',
        required: true,
        // regexPattern: '^[a-zA-Z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'Next Batch Number',
        name: 'nextNumber',
        type: 'number',
        placeholder: '234000000001',
        required: true,
        // regexPattern: '^[a-zA-Z ]+$',
        errorMessage: 'Invalid input.',
        
      },
    ],
    uiColumn: 3,
    isAddForm: true,
  };
};

export const hlr_batchRange_submitMethod = {
  isAddForm: async (formData) => {
    const sequenceId = await getHLRBatchMappingSequenceId();
    if (sequenceId && sequenceId.sequence_value) {
      formData['seq_id'] = sequenceId.sequence_value.toString();
    }
    return await createHLRBatchNumberRange(formData);
  },
  isEditForm: async (formData) => {
    const { seq_id } = formData;
    delete formData.seq_id;
    delete formData._id;
    return await updateHLRBatchNumberRange(formData, seq_id);
  },
};
