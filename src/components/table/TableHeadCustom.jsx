
import { TableRow, TableCell, TableHead, Typography } from '@mui/material';
import Visible from '../Visible';

export default function TableHeadCustom({
  order,
  orderBy,
  headLabel,
  onSort,
  sx,
}) {
  return (
    <TableHead sx={sx}>
      <TableRow >

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            <Visible when={onSort}>
              <Typography
                sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                {headCell?.label}
              </Typography>
            </Visible>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

