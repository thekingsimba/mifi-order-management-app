import { deleteHLRBatchRange } from "../../services/ApiService";

export const hlr_in_batch_table_config = {
  hiddenColumns: [
    '_id',
    'seq_id',
    'otaFileData',
    'outFileData',
    'locationCode',
    'subsidiaryCode',
    'resourceType',
    'deleted',
    'createdBy',
    'lastModifiedBy',
    'lastModifiedDate',
  ],
  tableBodyData: [],
  allowedActions: [], //'singleView', 'edit', 'delete'
};

export const hlr_in_batch_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    return await deleteHLRBatchRange(currentItemIndex);
  },
  getViewItemUrl: (itemId) => {
    const singleViewUrl = 'your/single/view/url/' + itemId;
    // console.log('url to navigate to single view' + singleViewUrl);
    return singleViewUrl;
  },
};
