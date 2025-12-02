import { Box, Button, Grid, MenuItem, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  RHFDatePicker,
  RHFSelect,
  RHFTextField,
} from '../../../components/hook-form';
import FormProvider from '../../../components/hook-form/FormProvider';
import { createHLRFormValidationSchema } from '../../sim-management-utils/sim-management-utils';

export const HlrForm = ({ allSimHLR, handleHlrData, hrlTableEmpty }) => {
  const method = useForm({
    // resolver: yupResolver(createHLRFormValidationSchema()),
    defaultValues: {
      graphKey: '',
      quantity: '',
      electricProfile: '',
      transportKey: '',
      hlr: '',
      expirtyDate: '',
    },
  });

  const { handleSubmit, reset } = method;
  return (
    <Box sx={{ marginBottom: hrlTableEmpty ? '100px' : '5px' }}>
      <FormProvider methods={method} onSubmit={handleSubmit(handleHlrData)}>
        <Grid
          container
          direction={'column'}
          justifyContent={'center'}
          p={2}
          textAlign={'center'}
          style={{ background: '#E8E8E8', color: 'white' }}
        >
          <Grid item>
            <Typography variant="p">HLR DETAILS</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} direction="row" alignItems="center" p={5}>
          <Grid item xs={4}>
            <RHFSelect name={'hlr'} label="HLR" variant="outlined" size="small">
              <MenuItem value={'choose'}>choose one...</MenuItem>
              {allSimHLR.length > 0 &&
                allSimHLR.map((hlr, index) => {
                  return (
                    <MenuItem key={index} value={hlr.hlr}>
                      {hlr.description}
                    </MenuItem>
                  );
                })}
            </RHFSelect>
          </Grid>
          <Grid item xs={4}>
            <RHFTextField
              label={'Transport key'}
              size="small"
              name={'transportKey'}
            />
          </Grid>
          <Grid item xs={4}>
            <RHFTextField
              label={'Electric profile'}
              size="small"
              name={'electricProfile'}
            />
          </Grid>

          <Grid item xs={4}>
            <RHFTextField label={'Quantity'} size="small" name={'quantity'} />
          </Grid>

          <Grid item xs={4}>
            <RHFTextField
              label={'Graphical profile'}
              size="small"
              name={'graphKey'}
            />
          </Grid>
          <Grid item xs={4} sx={{ position: 'relative' }}>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              style={{
                marginTop: '10px',
                position: 'absolute',
                right: '0',
              }}
            >
              Add HRL
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
};
