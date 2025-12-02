import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Paper,
  Stack,
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormHelperText,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import useResponsive from '../../hooks/useResponsive';

DateRangePicker.propTypes = {
  open: PropTypes.bool,
  isError: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onChangeEndDate: PropTypes.func,
  onChangeStartDate: PropTypes.func,
  variant: PropTypes.oneOf(['input', 'calendar']),
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
};

export default function DateRangePicker({
  title = 'Select date range',
  variant = 'input',
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
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
          <>
            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
            >
              <DateCalendar value={dayjs(startDate)} onChange={onChangeStartDate} />
            </Paper>
            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
            >
              <DateCalendar value={dayjs(endDate)} onChange={onChangeEndDate} />
            </Paper>
          </>
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