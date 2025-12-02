import {
  createHLRImsiNumberRange,
  getHLRImsiNumberRangeSequenceId,
  getSimHRL,
  updateHLRImsiNumberRange,
} from '../../../services/ApiService';
import { removePrefix } from '../../sim-management-utils/sim-management-utils';

const hlrFurList = async () => {
  try {
    const response = await getSimHRL();
    return response.map((item) => {
      // console.log(item.hlrCode, " the hrl code")
      return { selectItem: item.hlrCode, itemValue: item.hlrCode };
    });
  } catch (error) {
    return [];
  }
};

export const hlr_ImsiRange_config_form = {};

export const provideImsiRangeFormConfig = async () => {
  return {
    inputConfig: [
      {
        label: 'HLR IMSI Prefix Number',
        name: 'imsiPrefixNumber',
        type: 'text',
        placeholder: '6 digits',
        required: true,
        errorMessage: 'the value should be only 6 digits number',
      },
      {
        label: 'HLR IMSI Start Number',
        name: 'startNumber',
        type: 'number',
        placeholder: '6 digits',
        required: true,
        errorMessage: 'the value should be only 15 digits number',
      },
      {
        label: 'HLR IMSI Last Number Used',
        name: 'lastNumberUsed',
        type: 'number',
        placeholder: '621308299999999',
        required: true,
        errorMessage: 'the value should be only 15 digits number',
      },
      {
        label: 'HLR IMSI End Number',
        name: 'endNumber',
        type: 'number',
        placeholder: '621308299999999',
        required: true,
        errorMessage: 'the value should be only 15 digits number',
      },
      {
        label: 'FUR/UDC',
        type: 'select',
        name: 'hlrFur',
        possibleSelectValue: await hlrFurList(),
        required: true,
      },
    ],
    uiColumn: 4,
    isAddForm: true,
  };
};

export const hlr_ImsiRange_submitMethod = {
  isAddForm: async (formData) => {
    const sequenceId = await getHLRImsiNumberRangeSequenceId();
    if (sequenceId && sequenceId.sequence_value) {
      formData['seq_id'] = sequenceId.sequence_value.toString();
    }
    const startNumber = removePrefix(6, formData.startNumber);
    const endNumber = removePrefix(6, formData.endNumber);
    const lastNumberUsed = removePrefix(6, formData.lastNumberUsed);

    formData['startNumber'] = startNumber;
    formData['endNumber'] = endNumber;
    formData['lastNumberUsed'] = Number(lastNumberUsed);

    return await createHLRImsiNumberRange(formData);
  },
  isEditForm: async (formData) => {
    const startNumber = removePrefix(6, formData.startNumber);
    const endNumber = removePrefix(6, formData.endNumber);
    const lastNumberUsed = removePrefix(6, formData.lastNumberUsed);

    formData['startNumber'] = startNumber;
    formData['endNumber'] = endNumber;
    formData['lastNumberUsed'] = Number(lastNumberUsed);

    const { seq_id } = formData;
    delete formData.seq_id;
    delete formData._id;

    //console.log(formData);
    return await updateHLRImsiNumberRange(formData, seq_id);
  },
};
