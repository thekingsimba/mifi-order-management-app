import { TableBody, TableCell } from '@mui/material';

import { TableBodyRowChecked } from '../../components/tsat-style/TsatStyle';

const SimTableBody = ({ propsFromTable }) => {
  const { tableProps, tablePaginationProp } = propsFromTable;
  const { TableDisplayData, tableHeaderColums } = tableProps;
  const { page, rowsPerPage } = tablePaginationProp;

  const headerList = tableHeaderColums
    .filter((header) => header.id != 'select')
    .map((headerItem) => headerItem.id);

  const newArrayToDisplay = [];

  TableDisplayData.forEach((element) => {
    const newObject = {};

    headerList.forEach((headerKey) => {
      newObject[headerKey] = element[headerKey];
    });

    newArrayToDisplay.push(newObject);
  });

  return (
    <TableBody>
      {newArrayToDisplay
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((item, index) => {
          return renderTableRow(item, index);
        })}
    </TableBody>
  );
};

export default SimTableBody;

const renderTableCell = (item, field) => (
  <TableCell key={field}>{item[field]}</TableCell>
);

const renderTableRow = (item, index) => {
  return (
    <TableBodyRowChecked key={index}>
      {Object.keys(item).map((field) => {
        if (field) {
          return renderTableCell(item, field);
        } else {
          return null;
        }
      })}
    </TableBodyRowChecked>
  );
};
