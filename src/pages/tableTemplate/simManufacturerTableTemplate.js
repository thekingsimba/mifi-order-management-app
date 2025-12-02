import { deleteSimManufacturers } from '../../services/ApiService';

export const sim_manufacturer_table_config = {
  hiddenColumns: ['_id', 'seq_id', 'id', 'deleted'],
  tableBodyData: [],
  allowedActions: ['singleView', 'edit', 'delete'],
};

export const sim_manufacturer_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    return await deleteSimManufacturers(currentItemIndex);
  },
  getViewItemUrl: (itemId) => {
    const singleViewUrl = 'your/single/view/url/' + itemId;
    return singleViewUrl;
  },
};
