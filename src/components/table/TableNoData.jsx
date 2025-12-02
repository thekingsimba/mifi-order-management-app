
import { TableRow, TableCell, Stack, Typography } from '@mui/material';


export default function TableNoData({ isNotFound }) {
  return (
    <TableRow>
      {isNotFound ? (
        <TableCell colSpan={12}>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }} justifyContent="space-between" alignItems="center">


            <Typography noWrap>No data Found</Typography>
          </Stack>
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
