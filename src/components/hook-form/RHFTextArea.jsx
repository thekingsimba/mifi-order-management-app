
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

export function RHFTextArea({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      id={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={field.value}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
          multiline
          rows={4}
        />
      )}
    />
  );
}

