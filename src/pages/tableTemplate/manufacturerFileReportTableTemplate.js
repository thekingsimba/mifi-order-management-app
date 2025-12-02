import { deleteSimTypes } from '../../services/ApiService';

export const manufacturerFileReport_table_config = {
  hiddenColumns: ['batchNumber', 'otaFileData', 'outFileData'],
  tableBodyData: [],
  allowedActions: [],
};

export const manufacturerFileReport_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    return await deleteSimTypes(currentItemIndex);
  },
  getViewItemUrl: (itemId) => {
    const singleViewUrl = 'your/single/view/url/' + itemId;
    return singleViewUrl;
  },
};
