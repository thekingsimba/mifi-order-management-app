import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';

const CustomTextInput = ({
  id,
  value,
  onChange,
  disabled,
  schema,
  uiSchema,
  ...props
}) => {
  const handleChange = (event) => {
    const newValue = event.target.value;
    // Only call onChange if maxLength is not exceeded
    if (!schema.maxLength || newValue.length <= schema.maxLength) {
      onChange(newValue);
    }
  };

  return (
    <TextField
      id={id}
      value={value || ''}
      onChange={handleChange}
      disabled={disabled}
      label={uiSchema['ui:title'] || schema.title}
      fullWidth
      variant={uiSchema['ui:variant'] || 'outlined'}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

CustomTextInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  schema: PropTypes.shape({
    title: PropTypes.string,
    maxLength: PropTypes.number,
  }).isRequired,
  uiSchema: PropTypes.object,
};

CustomTextInput.defaultProps = {
  value: '',
  disabled: false,
  uiSchema: {},
};

export default CustomTextInput;
