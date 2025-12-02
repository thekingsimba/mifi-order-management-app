import { deleteSimConnectionTypes, deleteSimTypes } from '../../services/ApiService';

export const connection_type_table_config = {
  hiddenColumns: ['_id', 'seq_id', 'id', 'deleted'],
  tableBodyData: [],
  allowedActions: ['edit', 'delete'], //'singleView', 'edit', 'delete'
};

export const connection_type_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    console.log(currentItemIndex);
    return await deleteSimConnectionTypes(currentItemIndex);
  },
  getViewItemUrl: (itemId) => {
    const singleViewUrl = 'your/single/view/url/' + itemId;
    console.log('url to navigate to single view' + singleViewUrl);
    return singleViewUrl;
  },
};
