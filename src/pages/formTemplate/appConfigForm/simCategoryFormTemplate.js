import {
  createSimCategories,
  getSIMCategorySequenceID,
  getSimConnectionTypes,
  getSimTypes,
  updateSimCategories,
} from '../../../services/ApiService';

const connectionTypeList = async () => {
  try {
    const response = await getSimConnectionTypes();
    return response.map((item) => {
      return { selectItem: item.type, itemValue: item.value };
    });
  } catch (error) {
    return [];
  }
};

const simTypeList = async () => {
  try {
    const response = await getSimTypes();
    return response.map((item) => {
      return { selectItem: item.code, itemValue: item.description };
    });
  } catch (error) {
    return [];
  }
};

export const sim_category_form_config = {};
export const provideSimCategoryFormConfig = async () => {
  return {
    inputConfig: [
      {
        label: 'SIM Category Code',
        type: 'text',
        name: 'code',
        placeholder: 'SIMP',
        required: true,
        // regexPattern: '^[A-Za-z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'Description',
        type: 'text',
        name: 'description',
        placeholder: 'PREPAID SIM CATEGORY',
        required: true,
        // regexPattern: '^[a-zA-Z ]+$',
        errorMessage: 'Invalid input.',
      },
      {
        label: 'SIM Type',
        type: 'select',
        name: 'simType',
        required: true,
        possibleSelectValue: await simTypeList(),
      },
      {
        label: 'Connection Type',
        type: 'select',
        name: 'connectionType',
        required: true,
        possibleSelectValue: await connectionTypeList(),
      },
      {
        label: 'Quarantine Period(In Days)',
        type: 'number',
        name: 'quarantinePeriod',
        placeholder: '23',
        required: true,
        // regexPattern: '^[0-9 ]+$',
        errorMessage: 'Invalid input.',
      },
    ],
    uiColumn: 2,
    isAddForm: true,
  };
};

export const sim_category_submitMethod = {
  isAddForm: async (formData) => {
    const sequenceId = await getSIMCategorySequenceID();
    if (sequenceId && sequenceId.sequence_value) {
      formData['seq_id'] = sequenceId.sequence_value.toString();
    }
    return await createSimCategories(formData);
  },
  isEditForm: async (formData) => {
    const { seq_id } = formData;
    delete formData.seq_id;
    delete formData._id;
    return await updateSimCategories(formData, seq_id);
  },
};
