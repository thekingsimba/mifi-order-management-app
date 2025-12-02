import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Paper,
  Stack,
} from '@mui/material';
import dayjs from 'dayjs';

import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import useResponsive from '../../hooks/useResponsive';

export default function SingleDatePicker({
  title = 'Select date',
  variant = 'input',
  date,
  onChangeDate,
  open,
  onClose,
  isError,
}) {
  const isDesktop = useResponsive('up', 'md');
  const isCalendarView = variant === 'calendar';
  return (
    <Dialog
      fullWidth
      maxWidth={isCalendarView ? false : 'xs'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          ...(isCalendarView && {
            maxWidth: 720,
          }),
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
      <DialogContent
        sx={{
          ...(isCalendarView &&
            isDesktop && {
              overflow: 'unset',
            }),
        }}
      >
        <Stack
          spacing={isCalendarView ? 3 : 2}
          direction={isCalendarView && isDesktop ? 'row' : 'column'}
          justifyContent="center"
          sx={{
            pt: 1,
            '& .MuiCalendarPicker-root': {
              ...(!isDesktop && {
                width: 'auto',
              }),
            },
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: 'divider',
              borderStyle: 'dashed',
            }}
          >
            <DateCalendar value={dayjs(date)} onChange={onChangeDate} />
          </Paper>
        </Stack>
        {isError && (
          <FormHelperText error sx={{ px: 2 }}>
            End date must be later than start date
          </FormHelperText>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isError} variant="contained" onClick={onClose}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
