import { Grid, Paper } from '@mui/material';
import { useRef } from 'react';

import SchemaForm from '../schemaForm';

const OverviewContent = () => {
  const formRef = useRef();
  const handleSubmit = async (updatedFormData, e, callback) => {
    // console.log(updatedFormData)
  };
  return (
    <Paper>
      <Grid spacing={2} direction="column" container justifyContent="flex-end">
        <Grid item>
          <SchemaForm
            name="custom-form"
            onSubmit={handleSubmit}
            initialData={{}}
            ref={formRef}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
export default OverviewContent;
