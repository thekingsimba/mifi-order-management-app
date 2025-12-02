import {
  createHLRSerialNumberRange,
  getHLRSerialNumberRangeSequenceId,
  updateHLRSerialNumberRange,
} from '../../../services/ApiService';
import { removePrefix } from '../../sim-management-utils/sim-management-utils';

export const hlr_serialNb_Range_config_form = {};

export const provideSerialNbRangeFormConfig = async () => {
  return {
    inputConfig: [
      {
        label: 'Serial Number Prefix',
        name: 'serialNumberPrefix',
        type: 'text',
        placeholder: '9 digits',
        required: true,
        errorMessage: 'the value should be only 9 digits number',
      },
      {
        label: 'Last Serial Number Used',
        name: 'lastSrNumberUsed',
        type: 'text',
        placeholder: '10 digits',
        required: true,
        errorMessage: 'the value should be only 10 digits number',
      },
      {
        label: 'Next Serial Number',
        name: 'nextSrNumber',
        type: 'number',
        placeholder: '00000002',
        required: true,
        errorMessage: 'Invalid input.',
      },
    ],
    uiColumn: 3,
    isAddForm: true,
  };
};

export const hlr_serialNbRange_submitMethod = {
  isAddForm: async (formData) => {
    const lastSrNumberUsed = removePrefix(9, formData.lastSrNumberUsed);

    const sequenceId = await getHLRSerialNumberRangeSequenceId();
    if (sequenceId && sequenceId.sequence_value) {
      formData['seq_id'] = sequenceId.sequence_value.toString();
    }

    formData['lastSrNumberUsed'] = Number(lastSrNumberUsed);

    return await createHLRSerialNumberRange(formData);
  },
  isEditForm: async (formData) => {
    const lastSrNumberUsed = removePrefix(9, formData.lastSrNumberUsed);
    formData['lastSrNumberUsed'] = Number(lastSrNumberUsed);

    const { seq_id } = formData;
    delete formData.seq_id;
    delete formData._id;

    return await updateHLRSerialNumberRange(formData, seq_id);
  },
};
 
 