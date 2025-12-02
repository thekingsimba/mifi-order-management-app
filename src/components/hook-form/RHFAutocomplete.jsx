
import { useFormContext, Controller } from 'react-hook-form';

import { Autocomplete, TextField } from '@mui/material';

export default function RHFAutocomplete({ name, label, helperText, ...other }) {
    const { control, setValue } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    onChange={(_event, newValue) => setValue(name, newValue, { shouldValidate: true })}
                    renderInput={(params) => (
                        <TextField
                            label={label}
                            error={!!error}
                            helperText={error ? error?.message : helperText}
                            {...params}
                        />
                    )}
                    {...other}
                />
            )}
        />
    );
}
