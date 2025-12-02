import { useEffect, useState } from 'react';

import CustomTable from '../../components/table/CustomTable';
import { formFromCamelCase } from '../../pages/sim-management-utils/sim-management-utils.js';
import DynamicTableBody from './DynamicTableBody';

function DynamicTable({
  tableConfig,
  tableStyle = { fontSize: '12px' },
  tableWidth = 'none',
}) {
  //console.log('tableStyle', tableStyle);

  const [tableHeader, setTableHeader] = useState([]);
  const displayTableHeader = (tableKeyValueData = []) => {
    if (tableKeyValueData?.length > 0) {
      const objSample = tableKeyValueData[0] || {};
      const rebuiltHeaders = Object?.keys(objSample).map((key) => {
        return { id: key, label: formFromCamelCase(key), visible: true };
      });
      const validHeader = rebuiltHeaders.filter((headerObject) => {
        return !tableConfig.hiddenColumns.includes(headerObject.id);
      });
      // console.log(tableConfig.hiddenColumns);
      setTableHeader(validHeader);
    }
  };

  useEffect(() => {
    displayTableHeader(tableConfig.tableBodyData);
  }, [tableConfig]);

  return (
    <CustomTable
      showActionsColumn={!!tableConfig?.allowedActions?.length}
      tableHeaderColumns={tableHeader || []}
      tableDisplayData={tableConfig.tableBodyData || []}
      tableType="dynamicTable"
      headerStyle={tableStyle}
      tableWidth={tableWidth}
      renderTableBody={(propsFromTable) => (
        <DynamicTableBody
          bodyStyle={tableStyle}
          propsFromTable={propsFromTable}
        />
      )}
      loadingData={false}
    />
  );
}

export default DynamicTable;
