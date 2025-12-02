import {
  createSimConnectionTypes,
  getSIMConnectionTypeSequenceID,
  updateSimConnectionTypes,
} from '../../../services/ApiService';

export const connection_type_form_config = {};

export const provideConnectionTypeFormConfig = () => {
  return {
    inputConfig: [
      {
        label: 'SIM Connection Type Code',
        type: 'text',
        name: 'type',
        value: '',
        placeholder: 'POST-PAID',
        required: true,
        // regexPattern: '^[A-Za-z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'Description',
        name: 'value',
        value: '',
        type: 'text',
        placeholder: 'POSTPAID',
        required: true,
        // regexPattern: '^[a-zA-Z ]+$',
        errorMessage: 'Invalid input.',
      },
    ],
    uiColumn: 2,
    isAddForm: true,
  };
};

export const connection_type_submitMethod = {
  isAddForm: async (formData) => {
    const sequenceId = await getSIMConnectionTypeSequenceID();
    if (sequenceId && sequenceId.sequence_value) {
      formData['seq_id'] = sequenceId.sequence_value.toString();
    }
    return await createSimConnectionTypes(formData);
  },
  isEditForm: async (formData) => {
    const { seq_id } = formData;
    delete formData.seq_id;
    delete formData._id;
    // console.log(formData, seq_id);
    return await updateSimConnectionTypes(formData, seq_id);
  },
};
