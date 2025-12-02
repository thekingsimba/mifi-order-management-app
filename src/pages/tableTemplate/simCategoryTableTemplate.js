import { deleteSimCategories } from '../../services/ApiService';

export const sim_category_table_config = {
  hiddenColumns: [
    '_id',
    'quarantinePeriod',
    'lastModifiedOn',
    'lastModifiedDate',
    'lastModifiedBy',
    'seq_id',
    'id',
    'deleted',
  ],
  tableBodyData: [],
  allowedActions: ['singleView', 'edit', 'delete'],
};

export const sim_category_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    return await deleteSimCategories(currentItemIndex);
  },
  getViewItemUrl: (itemId) => {
    const singleViewUrl = 'your/single/view/url/' + itemId;
    return singleViewUrl;
  },
};
