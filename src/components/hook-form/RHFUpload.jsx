
import { useFormContext, Controller } from 'react-hook-form';
import { FormHelperText } from '@mui/material';
import { Upload } from '../../components/upload';

export function RHFUpload({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        <Upload
          file={field.value}
          error={!!error}
          helperText={
            (!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )
          }
          {...other}
        />

      }
    />
  );
}
