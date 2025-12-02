/* eslint-disable react/prop-types */
import React from 'react';

// MUI
import { Grid, Stack, Typography, useTheme } from '@mui/material';

// lodash
import dayjs from 'dayjs';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import { DATE_FORMAT } from '../../../utils/constants';

const ObjectFieldTemplate = ({ props, layout, isEditMode }) => {
  const theme = useTheme();

  const isReadOnly = {
    // Hide the asterisk indicating required fields in read-only mode.
    '& .MuiFormLabel-asterisk': {
      display: 'none',
    },
    // Set the input text color and remove border color for read-only fields.
    '& .MuiInputBase-input': {
      borderColor: 'transparent',
      color: theme.palette.text.primary,
    },
    // Remove border color for select menus in read-only mode.
    '& .MuiSelect-selectMenu': {
      borderColor: 'transparent',
    },
    // Style for disabled elements in read-only mode.
    '& .Mui-disabled': {
      opacity: 1, // Make disabled elements fully visible.
    },
    // Remove underline before the input field in read-only mode.
    '& .MuiInput-underline': {
      '&:before': {
        content: 'none',
      },
    },
    // Hide the dropdown arrow for select components in read-only mode.
    '& .MuiSelect-icon': {
      display: 'none',
    },
    // Set the label color
    '& .MuiFormControlLabel-label': {
      color: theme.palette.text.primary,
    },
    // Set the checkbox color
    '& .MuiCheckbox-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiFormLabel-root': {
      fontWeight: '400',
      opacity: 1,
      textTransform: 'uppercase',
    },
    '& .MuiFormGroup-root': {
      flexDirection: 'row',
    },
  };

  const isEditOnly = {
    '& .MuiFormLabel-asterisk': {
      color: theme.palette.error.main, // Changes the color of asterisks (*) to an error color for required fields.
    },
    '& .MuiInputLabel-root': {
      // textTransform: 'uppercase', // Converts text in input labels to uppercase.
    },
    '& .MuiFormLabel-root': {
      fontWeight: '400',
    },
    '& .MuiFormGroup-root': {
      flexDirection: 'row',
    },
  };

  const horizontalLine = {
    borderTop: `${theme.spacing(0.2)} solid grey`,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    paddingBottom: 0,
  };

  const subHeading = {
    textTransform: 'uppercase',
  };

  const subHeadingWrapper = {
    paddingTop: '0 !important',
  };

  const { rootSpacing } = layout;
  const {
    xl: defaultXl = 3,
    lg: defaultLg = 3,
    md: defaultMd = 4,
    sm: defaultSm = 6,
    xs: defaultXs = 12,
  } = layout;

  const renderFields = (element) => {
    const customLayout = _get(element, 'content.props.schema.layout');
    const variant = _get(element, 'content.props.schema.variant', '');
    const title = _get(element, 'content.props.schema.title', '');
    const formData = _get(element, 'content.props.formData', '');
    const schema = _get(element, 'content.props.schema', {});
    const format = _get(schema, 'fullProperty.format', '');

    const layoutProps = {
      xs: defaultXs,
      sm: defaultSm,
      md: defaultMd,
      xl: defaultXl,
      lg: defaultLg,
    };

    if (!isEditMode) {
      // Display mode
      let value = formData.toString();
      if (format === 'enum' && schema.enum && schema.enumNames) {
        const idxData = schema.enum.findIndex((i) => i === value);
        value = schema.enumNames[idxData];
      } else if (format === 'date') {
        value = dayjs(formData.toString()).format(DATE_FORMAT.standard);
      }
      return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Grid item {...layoutProps} sx={!isEditMode ? isReadOnly : isEditOnly}>
          <Stack spacing={1}>
            <Typography variant="caption">{title}</Typography>
            <Typography variant="body1" fontWeight={500}>
              {value}
            </Typography>
          </Stack>
        </Grid>
      );
    }

    let preparedLayout;
    if (customLayout) {
      const { xs, sm, md, xl } = customLayout;
      preparedLayout = (
        <Grid
          item
          xs={xs}
          sm={sm}
          md={md}
          xl={xl}
          sx={!isEditMode ? isReadOnly : isEditOnly}
        >
          {element.content}
        </Grid>
      );
    } else if (variant === 'horizontalLine') {
      preparedLayout = (
        <Grid item xs={12} md={12} sm={12} xl={12} sx={horizontalLine} />
      );
    } else if (variant === 'subHeading') {
      preparedLayout = (
        <Grid item xs={12} md={12} sm={12} xl={12} sx={subHeadingWrapper}>
          <Typography variant="body1" sx={subHeading}>
            {title}
          </Typography>
        </Grid>
      );
    } else {
      const { xs, sm, md, xl, lg } = element.layout || layout;
      preparedLayout = (
        <Grid
          item
          xs={xs || defaultXs}
          sm={sm || defaultSm}
          md={md || defaultMd}
          xl={xl || defaultXl}
          lg={lg || defaultLg}
          sx={!isEditMode ? isReadOnly : isEditOnly}
        >
          {element.content}
        </Grid>
      );
    }
    return preparedLayout;
  };

  const required = props.properties.filter((i) =>
    _get(i, 'content.props.required')
  );
  const optionalArr = props.properties.filter(
    (i) => !_get(i, 'content.props.required')
  );
  const lineItem = optionalArr.find((i) => i.name === 'line');
  const opItem = optionalArr.find((i) => i.name === 'OptionalDetails');
  const optional = optionalArr.filter(
    (i) => i.name !== 'line' && i.name !== 'OptionalDetails'
  );

  if (opItem) optional.unshift(opItem);
  if (lineItem) optional.unshift(lineItem);

  return (
    <Grid container spacing={rootSpacing || 4}>
      {required.map(renderFields)}
      {optional.map(renderFields)}
    </Grid>
  );
};

ObjectFieldTemplate.propTypes = {
  props: PropTypes.shape({
    properties: PropTypes.arrayOf({
      content: PropTypes.object,
    }),
  }).isRequired,
  layout: PropTypes.shape({
    xl: PropTypes.number,
    lg: PropTypes.number,
    md: PropTypes.number,
    sm: PropTypes.number,
    xs: PropTypes.number,
    rootSpacing: PropTypes.number,
  }),
  isEditMode: PropTypes.bool,
};

ObjectFieldTemplate.defaultProps = {
  layout: {},
  isEditMode: false,
};
export default React.memo(ObjectFieldTemplate);
