import { deleteSimHRLConfig } from "../../services/ApiService";

export const hlr_config_table_config = {
  hiddenColumns: [
    '_id',
    'id',
    'deleted',
    'description',
    'region',
    'seq_id',
    'lastModifiedBy',
  ],
  tableBodyData: [],
  allowedActions: ['edit', 'delete'], //'singleView', 'edit', 'delete'
};

export const hlr_Config_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    return await deleteSimHRLConfig(currentItemIndex)
  },
  getViewItemUrl: (itemId) => {
    const singleViewUrl = 'your/single/view/url/' + itemId;
    return singleViewUrl;
  },
};
