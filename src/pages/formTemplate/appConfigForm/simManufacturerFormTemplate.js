import {
  createSimManufacturers,
  getSIMManufacturerSequenceID,
  updateSimManufacturers,
} from '../../../services/ApiService';

export const sim_manufacturer_form_config = {};

export const provideSimManufacturerFormConfig = () => {
  return {
    inputConfig: [
      {
        label: 'Manufacture Code',
        type: 'text',
        name: 'manufactureCode',
        placeholder: 'AS01',
        required: true,
        errorMessage: 'Invalid input.',
      },
      {
        label: 'Manufacture Name',
        type: 'text',
        name: 'name',
        placeholder: 'MICRO SIM MANUFACTURER',
        required: true,
        errorMessage: 'Invalid input.',
      },
      {
        label: 'Address 1',
        type: 'text',
        name: 'address1',
        placeholder: 'PLOT 6084/6085',
        required: true,
        errorMessage: 'Invalid input.',
      }
    ],
    uiColumn: 2,
    isAddForm: true,
  };
};

export const sim_manufacturer_submitMethod = {
  isAddForm: async (formData) => {
    const sequenceId = await getSIMManufacturerSequenceID();
    if (sequenceId && sequenceId.sequence_value) {
      formData['seq_id'] = sequenceId.sequence_value.toString();
    }
    return await createSimManufacturers(formData);
  },
  isEditForm: async (formData) => {
    const { seq_id } = formData;
    delete formData.seq_id;
    delete formData._id;
    return await updateSimManufacturers(formData, seq_id);
  },
};
