import PropTypes from 'prop-types';

const Visible = ({ when, otherwise=null, children }) =>
  when ? children : otherwise;

Visible.propTypes = {
  when: PropTypes.bool.isRequired,
  otherwise: PropTypes.node,
  children: PropTypes.node.isRequired,
};

// Visible.defaultProps = {
//   otherwise: null,
// };

export default Visible;
