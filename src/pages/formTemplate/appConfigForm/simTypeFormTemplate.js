import {
  createSimTypes,
  getSIMTypeSequenceID,
  updateSimTypes,
} from '../../../services/ApiService';

export const sim_type_form_config = {};

export const provideSimTypeFormConfig = () => {
  return {
    inputConfig: [
      {
        label: 'Code',
        type: 'text',
        name: 'code',
        value: '',
        placeholder: 'SIM type code',
        required: true,
        //regexPattern: '^[A-Za-z0-9 ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'Description',
        type: 'text',
        name: 'description',
        value: '',
        placeholder: 'Description',
        required: true,
        // regexPattern: '^[A-Za-z ]+$',
        errorMessage: 'Invalid input.',
      },
    ],
    uiColumn: 2,
    isAddForm: true,
  };
};

export const sim_type_submitMethod = {
  isAddForm: async (formData) => {
    const sequenceId = await getSIMTypeSequenceID();
    if (sequenceId && sequenceId.sequence_value) {
      formData['seq_id'] = sequenceId.sequence_value.toString();
    }

    return await createSimTypes(formData);
  },
  isEditForm: async (formData) => {
    const { seq_id } = formData;
    delete formData.seq_id;
    delete formData._id;
    return await updateSimTypes(formData, seq_id);
  },
};
