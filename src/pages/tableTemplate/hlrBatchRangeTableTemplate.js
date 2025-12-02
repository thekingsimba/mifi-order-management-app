import { deleteHLRBatchRange } from '../../services/ApiService';

export const hlr_batchRange_table_config = {
  hiddenColumns: [
    '_id',
    'seq_id',
    'outfilesStatus',
    'outfilesInfo',
    'deleted',
    'createdBy',
    'lastModifiedBy',
    'lastModifiedDate',
    'otafileName',
    'outfileName',
    'manufacturerFilesStatus',
    'manufacturerFilesInfo',
  ],
  tableBodyData: [],
  allowedActions: ['edit', 'delete'], //'singleView', 'edit', 'delete'
};

export const hlr_batchRange_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    return await deleteHLRBatchRange(currentItemIndex);
  },
  getViewItemUrl: (itemId) => {
    const singleViewUrl = 'your/single/view/url/' + itemId;
    console.log('url to navigate to single view' + singleViewUrl);
    return singleViewUrl;
  },
};
