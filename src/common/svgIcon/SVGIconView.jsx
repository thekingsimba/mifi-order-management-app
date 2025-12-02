import { styled } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import Svg from 'react-inlinesvg';

const StyledSvg = styled(Svg)(() => ({
  color: 'blue',
}));

const SVGIcon = (props) => {
  const { iconName = '', iconWidth = 30, iconHeight = 30 } = props;
  if (iconName) {
    return (
      <StyledSvg
        src={iconName}
        width={iconWidth}
        height={iconHeight || iconWidth}
        cacheRequests
      />
    );
  }
  return null;
};
SVGIcon.propTypes = {
  iconName: PropTypes.string,
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
};

// SVGIcon.defaultProps = {
//   iconName: '',
//   iconHeight: 30,
//   iconWidth: 30,
// };
export default SVGIcon;
