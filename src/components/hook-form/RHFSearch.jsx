
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

export function RHFSearch({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      // control={control}
      sx={{
        border:"none",
        borderColor: "transparent",
        outline:"none",
        height: "0.1em",
        padding: 2,
        background: "red"
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          // style={{
          //   border:"none",
          //   outline:"none",
          //   height: "0.1em",
          //   padding: 2
          // }}
          
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}