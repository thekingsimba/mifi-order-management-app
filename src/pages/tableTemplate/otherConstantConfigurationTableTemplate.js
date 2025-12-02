import { deleteSimConstantConfig } from "../../services/ApiService";

export const other_constant_config_table_config = {
  hiddenColumns: ['_id', 'id', 'deleted', 'seq_id'],
  tableBodyData: [],
  allowedActions: ['edit', 'delete'], //'singleView', 'edit', 'delete'
};

export const other_constant_Config_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    return await deleteSimConstantConfig(currentItemIndex)
  },
  getViewItemUrl: (itemId) => {
    const singleViewUrl = 'your/single/view/url/' + itemId;
    return singleViewUrl;
  },
};
