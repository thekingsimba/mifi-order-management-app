export const batch_mapping_simulation_table_config = {
  hiddenColumns: [
    '_id',
    'hlrFur',
    'seq_id',
    'simOrderId',
    'poNumber',
    'simType',
    'simCategory',
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
  allowedActions: [], //'singleView', 'edit', 'delete'
};

export const batch_mapping_simulation_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    console.log(currentItemIndex);
  },
  getViewItemUrl: (concernedObject) => {
    const singleViewUrl = `/sim-manager/${concernedObject.simOrderId}/batch/${concernedObject.batchNumber}/imsi-start/${concernedObject.imsiStartNumber}/imsi-end/${concernedObject.imsiEndNumber}`;
    // console.log('url to navigate to single view' + singleViewUrl);
    return singleViewUrl;
  },
};
