import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider from '../../../components/hook-form/FormProvider';
import { MenuItem, Button, Grid } from '@mui/material';
import { RHFSelect, RHFTextField } from '../../../components/hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { searchOrders } from '../../../redux/features/manage-sim/simManagementDataSlice';
import { formFromCamelCase } from '../../sim-management-utils/sim-management-utils';
import theme from '../../../theme/theme';

export const TableHeadForm = ({ formTwoLabel }) => {
  const dispatch = useDispatch();
  const { allSimOrderData } = useSelector(
    (state) => state.simManagementDataSlice.simOrderGlobalData
  );
  const [dataKeys, setDataKeys] = useState([]);
  const method = useForm({
    // resolver: () => {},
    defaultValues: { fieldName: '', fieldValue: '' },
  });

  useEffect(() => {
    if (allSimOrderData.length) {
      const data = Object.keys(allSimOrderData[0]);
      setDataKeys(data);
    }
  }, []);

  const { handleSubmit } = method;

  const onHandleSubmit = (data) => {
    dispatch(
      searchOrders({ fieldName: data.fieldName, fieldValue: data.fieldValue })
    );
  };

  return (
    <FormProvider methods={method} onSubmit={handleSubmit(onHandleSubmit)}>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={4}>
          <RHFSelect
            name={'fieldName'}
            label="Field name"
            variant="outlined"
            size="small"
          >
            <MenuItem value={''}>Choose field</MenuItem>
            {dataKeys.length > 0 &&
              dataKeys.map((key, index) => {
                return (
                  <MenuItem key={index} value={key}>
                    {formFromCamelCase(key)}
                  </MenuItem>
                );
              })}
          </RHFSelect>
        </Grid>
        <Grid item xs={4}>
          <RHFTextField label={formTwoLabel} size="small" name={'fieldValue'} />
        </Grid>
        <Grid item xs={4}>
          <Button
            style={{
              background: theme.palette.primary.main,
              color: theme.palette.common.black,
            }}
            type="submit"
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
