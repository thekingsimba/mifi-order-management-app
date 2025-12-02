import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { TablePaginationCustom, useTable } from '../../components/table';
import TableSkeleton from './TableSkeleton';
import { CustomTableContainer, HeaderCell, TableWrapper } from './tableStyles';

const CustomTable = ({
  visibleColums = [],
  tableDisplayData = [],
  tableHeaderColumns = [],
  fullTableConfig = {},
  fullFormConfig = {},
  renderTableBody = '',
  tableType = '',
  loadingData,
  noDataMessage = '',
  showActionsColumn = true,
  headerStyle = '',
  tableWidth = 'none',
}) => {
  //console.log('headerStyle', headerStyle);

  //console.log(TableDisplayData);
  const {
    page,
    rowsPerPage,
    selected,
    onChangePage,
    onChangeRowsPerPage,
    setSelected,
  } = useTable({ dataLength: tableDisplayData.length });

  const handleSelectedRows = (event, id) => {
    let indexOfId = selected.indexOf(id);
    let newSelectedRows = [];
    if (indexOfId === -1) {
      newSelectedRows = newSelectedRows.concat(selected, id);
    } else if (indexOfId === 0) {
      newSelectedRows = newSelectedRows.concat(selected.slice(1));
    } else if (indexOfId === selected.length - 1) {
      newSelectedRows = newSelectedRows.concat(selected.slice(0, -1));
    } else if (indexOfId > 0) {
      newSelectedRows = newSelectedRows.concat(
        selected.slice(0, indexOfId),
        selected.slice(indexOfId + 1)
      );
    }
    setSelected(newSelectedRows);
  };

  const tableProps = {
    visibleColums,
    tableHeaderColumns,
    fullTableConfig,
    fullFormConfig,
    tableType,
    tableDisplayData,
    handleSelectedRows,
  };

  const tablePaginationProp = {
    page,
    rowsPerPage,
    selected,
  };

  return (
    <TableWrapper elevation={0}>
      <CustomTableContainer>
        <Table sx={{ width: tableWidth }} stickyHeader>
          <TableHead>
            <TableRow>
              {tableHeaderColumns.map((column) => (
                <HeaderCell sx={headerStyle} key={column.id}>
                  {column.label}
                </HeaderCell>
              ))}
              {showActionsColumn && (
                <HeaderCell sx={headerStyle}>Actions</HeaderCell>
              )}
            </TableRow>
          </TableHead>

          {loadingData ? (
            <TableSkeleton />
          ) : tableDisplayData.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={12}>
                  <Typography textAlign={'center'}>
                    {noDataMessage
                      ? noDataMessage
                      : 'No data to display, try changing dependent select field or change the search term or status fieldNo data to display, try changing dependent select field or change the search term or status field'}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <>
              {renderTableBody &&
                renderTableBody({ tableProps, tablePaginationProp })}
            </>
          )}
        </Table>

        <TablePaginationCustom
          count={tableDisplayData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </CustomTableContainer>
    </TableWrapper>
  );
};

export default CustomTable;
