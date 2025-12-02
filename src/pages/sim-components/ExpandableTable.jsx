import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';

import {
  ExpenderCell,
  HeaderExpenderCell,
  MainHeaderTableRowItem,
  MainTableHeaderWrapper,
  MainTableRowWrapper,
  TableRowItem,
} from '../../components/sim-styles/simStyles';
import TableBodyActionHandler from '../../components/table/TableBodyActionHandler';
import DateDisplay from './DateDisplay';

function ExpandableTable({
  mainTableHeaderList = [],
  tableDataList = [],
  detailsTableVisibleHeaderColumn,
  detailsTableHeaderColumn,
}) {
  const dispatch = useDispatch();

  const getOnlyVisibleColumn = mainTableHeaderList.filter(
    (element) => element.visible
  );

  return (
    <>
      <MainTableHeaderWrapper>
        {/* <HeaderExpenderCell>Expand</HeaderExpenderCell> */}
        {mainTableHeaderList.map(
          (headerItem, index) =>
            headerItem.visible && (
              <MainHeaderTableRowItem
                numberofrow={getOnlyVisibleColumn.length}
                key={headerItem.id + index}
              >
                {headerItem.label}
              </MainHeaderTableRowItem>
            )
        )}
        <HeaderExpenderCell>Actions</HeaderExpenderCell>
      </MainTableHeaderWrapper>

      {tableDataList.length > 0 &&
        tableDataList
          .filter((data) => data !== null)
          .map((mainRowItem, index) => {
            return (
              <Box key={index}>
                <MainTableRowWrapper>
                  {mainTableHeaderList.map(
                    (mainHeaderItem) =>
                      mainHeaderItem.visible && (
                        <TableRowItem
                          key={mainHeaderItem.id}
                          numberofrow={getOnlyVisibleColumn.length}
                        >
                          {mainHeaderItem.id === 'createdDate' ? (
                            <DateDisplay
                              date={mainRowItem[mainHeaderItem.id]}
                              formatNeeded="DD MMM YYYY"
                            />
                          ) : (
                            mainRowItem[mainHeaderItem.id]
                          )}
                        </TableRowItem>
                      )
                  )}
                  <ExpenderCell>
                    {/* Table body expandable action cell */}
                    <TableBodyActionHandler
                      tableType="sim"
                      dataId={mainRowItem.seq_id}
                      status={mainRowItem.status}
                    />
                  </ExpenderCell>
                </MainTableRowWrapper>
               
              </Box>
            );
          })}
    </>
  );
}

export default ExpandableTable;
