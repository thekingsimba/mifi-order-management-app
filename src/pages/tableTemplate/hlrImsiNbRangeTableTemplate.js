import { deleteHLRImsiNumberRange } from "../../services/ApiService";

export const hlr_ImsiRange_table_config = {
  hiddenColumns: [
    '_id',
    'seq_id',
    'deleted',
    'createdBy',
    'lastModifiedBy',
    'lastModifiedDate',
  ],
  tableBodyData: [],
  allowedActions: ['edit', 'delete'], //'singleView', 'edit', 'delete'
};

export const hlr_ImsiRange_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    return await deleteHLRImsiNumberRange(currentItemIndex);
  },
  getViewItemUrl: (itemId) => {
    const singleViewUrl = 'your/single/view/url/' + itemId;
    return singleViewUrl;
  },
};
