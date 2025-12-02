import { deleteSimTypes } from '../../services/ApiService';

export const sim_type_table_config = {
  hiddenColumns: ['_id', 'seq_id', 'id', 'deleted'],
  tableBodyData: [],
  allowedActions: ['edit', 'delete'],
};

export const sim_type_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    return await deleteSimTypes(currentItemIndex);
  },
  getViewItemUrl: (itemId) => {
    const singleViewUrl = 'your/single/view/url/' + itemId;
    return singleViewUrl;
  },
};
