import { styled, useTheme } from '@mui/material/styles';
import { TableRow, TableCell } from '@mui/material';

export const TableBodyCellWithAvatar = styled(TableCell)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: 'transparent',
  gap: '0.5rem',
}));

export const TableBodyRowChecked = styled(TableRow)(({ checkedrow }) => {
  const theme = useTheme();
  return {
    backgroundColor:
      checkedrow === 'true' ? `${theme.palette.primary.main}` : '',
  };
});
