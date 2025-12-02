
import { useFormContext, Controller } from 'react-hook-form';
import { Switch, FormControlLabel, FormHelperText } from '@mui/material';
import { useState } from 'react';

export default function RHFSwitch({ name, helperText,switchChange,initCheck, customSwitch=false, ...other }) {
    const { control } = useFormContext();
    const [check,setChecked] = useState(initCheck || false);

    return (
     <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
       <div>
        {customSwitch ? (
         <FormControlLabel
          control={
           <Switch
            {...field}
            size="small"
            onChange={(e) => {
                let val = switchChange(e)
                field.onChange(val)
                setChecked(e.target.checked)
               
            }
            }
            checked={check}
           />
          }
          {...other}
         />
        ) : (
         <FormControlLabel
          control={
           <Switch
            {...field}
            checked={field.value}
            size="small"
           />
          }
          {...other}
         />
        )}

        {(!!error || helperText) && (
         <FormHelperText error={!!error}>
          {error ? error?.message : helperText}
         </FormHelperText>
        )}
       </div>
      )}
     />
    );
}
