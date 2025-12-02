import { Grid, Paper, Typography } from '@mui/material';
import SearchInput from './SearchComponent';
import EmptyBox from './svg/EmptyBox';

const MsisdnOverview = () => {
  return (
    <Grid spacing={2} direction="column" container justifyContent="flex-start">
      <Grid item>
        <SearchInput />
      </Grid>
      <Grid item>
        <Paper>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={6}>
              <Typography>
                It seems like this page is empty right now.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <EmptyBox />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MsisdnOverview;
