import React from 'react';
import PropTypes from 'prop-types';
import SVGIconView from './SVGIconView';

const SVGIcon = ({ iconName, iconWidth=30, iconHeight=30 }) => (
  <SVGIconView
    iconName={iconName}
    iconWidth={iconWidth}
    iconHeight={iconHeight}
  />
)

SVGIcon.propTypes = {
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
  iconName: PropTypes.string.isRequired,
};

// const SVGIconDefaultProps = {
//   iconHeight: 30,
//   iconWidth: 30,
// };
export default SVGIcon;
