import { Stack, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { DATE_FORMAT } from '../../../utils/constants';

const RJSFDatePicker = ({
  value,
  onChange,
  required,
  disabled,
  readonly,
  autofocus,
  schema = {},
}) => {
  const dateValue = value ? dayjs(value) : null;
  const property = schema?.fullProperty || {};
  const formatPattern = property?.displayFormat;

  let minDate;
  let maxDate;

  if (property.minimumAge) {
    const today = dayjs();
    maxDate = today.subtract(property.minimumAge, 'year');
  }
  if (property.futureDateOnly) {
    const today = dayjs();
    minDate = property.futureDateOnly === 'today' ? today : today.add(1, 'day'); // Setting minDate to tomorrow for future dates only
  }
  if (property.pastDateOnly) {
    const today = dayjs();
    maxDate = today; // Setting maxDate to today for past dates only
  }

  const handleChange = (newValue) => {
    const formattedDate = newValue ? newValue.format(formatPattern) : null;
    onChange(formattedDate);
  };

  const isMobile = window.innerWidth < 600;
  const isMonthYearOnly = formatPattern === DATE_FORMAT.monthYear;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        sx={{ width: '100%' }}
        label={
          <Stack direction="row" spacing={1}>
            <Typography noWrap>{schema.title}</Typography>
            {required && <Typography color="error.main"> *</Typography>}
          </Stack>
        }
        disabled={disabled || readonly}
        readOnly={readonly}
        autoFocus={autofocus}
        value={dateValue}
        onChange={handleChange}
        renderInput={(params) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <TextField {...params} required={required} fullWidth />
        )}
        desktopModeMediaQuery={
          isMobile ? '(max-width:0px)' : '(min-width:600px)'
        }
        closeOnSelect
        minDate={minDate}
        maxDate={maxDate}
        openTo={isMonthYearOnly ? 'year' : 'day'}
        views={isMonthYearOnly ? ['year', 'month'] : undefined}
        format={formatPattern}
      />
    </LocalizationProvider>
  );
};

RJSFDatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  autofocus: PropTypes.bool,
  schema: PropTypes.shape({
    title: PropTypes.string,
    minimumAge: PropTypes.number,
    futureDateOnly: PropTypes.bool,
    onlyPastDates: PropTypes.bool,
    fullProperty: PropTypes.object,
  }).isRequired,
};

RJSFDatePicker.defaultProps = {
  value: '',
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
};

export default RJSFDatePicker;
