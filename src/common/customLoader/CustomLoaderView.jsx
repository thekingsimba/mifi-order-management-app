import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const StyledLoaderContainer = styled(Grid)({
  backgroundColor: (theme) => theme.palette.common.backdrop,
  zIndex: (theme) => theme.zIndex.tooltip,
  height: '100%',
  position: 'absolute',
});

function CustomLoaderView({ loaderProperty: { isLoader }, handleHideLoader = () => { } }) {
  useEffect(() => {
    handleHideLoader();
  }, []);

  return isLoader ? (
    <StyledLoaderContainer
      container
      justifyContent="center"
      alignContent="center"
    >
      <Grid item>
        <CircularProgress
          variant="indeterminate"
          disableShrink
          size={44}
          thickness={4}
        />
      </Grid>
    </StyledLoaderContainer>
  ) : null;
}

CustomLoaderView.propTypes = {
  loaderProperty: PropTypes.shape({
    isLoader: PropTypes.bool.isRequired,
  }).isRequired,
  handleHideLoader: PropTypes.func,
};

export default CustomLoaderView;
