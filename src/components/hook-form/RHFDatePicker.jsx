import dayjs from 'dayjs';
import { useFormContext, Controller } from 'react-hook-form';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
export function RHFDatePicker({ label, name, disablePast = false, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      id={name}
      control={control}
      render={({ field }) => (
        <MobileDatePicker
          {...field}
          fullWidth
          label={label}
          inputFormat="dd/MM/yyyy"
          value={dayjs(field.value)}
          disablePast={disablePast}
          onChange={(newValue) => {
            field.onChange(dayjs(newValue.$d).format('DD-MM-YYYY'));
          }}
          slotProps={{ textField: { variant: 'standard' } }}
          {...other}
        />
      )}
    />
  );
}
