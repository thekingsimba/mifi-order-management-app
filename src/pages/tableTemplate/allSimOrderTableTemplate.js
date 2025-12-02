export const allSimOrder_table_config = {
  hiddenColumns: [
    '_id',
    'seq_id',
    'comments',
    'simOrderId',
    'partCode',
    'customer',
    'simPrefix',
    'simCategory',
    'modifiedDate',
    'simManufacturerCode',
    'subsidiaryCode',
    'locationCode',
    'modifiedBy',
    'simConnectionType',
    'deleted',
    'createdBy',
    'lastModifiedBy',
    'lastModifiedDate',
  ],
  tableBodyData: [],
  allowedActions: ['singleView'], //'singleView', 'edit', 'delete'
};

export const allSimOrder_tableActionsMethod = {
  deleteItemMethod: async (currentItemIndex) => {
    console.log(currentItemIndex);
  },
  getViewItemUrl: (concernedObject) => {
    // console.log(concernedObject);
    const singleViewUrl = `/sim-manager/${concernedObject.seq_id}/`;
    return singleViewUrl;
  },
};
