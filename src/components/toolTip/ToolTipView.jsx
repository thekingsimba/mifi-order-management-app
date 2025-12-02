import Fade from '@mui/material/Fade';
import ToolTip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';

const ToolTipView = ({ message, children }) => (
  <ToolTip
    title={message}
    TransitionComponent={Fade}
    TransitionProps={{ timeout: 600 }}
    arrow
  >
    {children}
  </ToolTip>
);

ToolTipView.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ToolTipView;
