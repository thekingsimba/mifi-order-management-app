import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { RHFDatePicker } from '../hook-form/RHFDatePicker';
import { RHFSelect } from '../hook-form/RHFSelect';
import { RHFTextArea } from '../hook-form/RHFTextArea';
import { RHFTextField } from '../hook-form/RHFTextField';

const DynamicForm = ({ form_config, submitMethod = () => {} }) => {
  const validationSchema = Yup.object().shape(
    form_config?.inputConfig.reduce((acc, input) => {
      if (!input?.name) return acc;

      let validator;

      switch (input.type) {
        case 'text':
        case 'email':
        case 'password':
          validator = Yup.string();
          break;
        case 'number':
          validator = Yup.number();
          break;
        case 'date':
          validator = Yup.date();
          break;
        default:
          validator = Yup.mixed();
      }

      if (input?.required) {
        validator = validator.required(`${input.name} is required`);
      }

      if (input?.regexPattern) {
        validator = validator.matches(
          new RegExp(input.regexPattern),
          input?.errorMessage || `${input.name} is invalid`
        );
      }

      acc[input.name] = validator;
      return acc;
    }, {})
  );

  const defaultValues = form_config?.inputConfig.reduce((acc, input) => {
    acc[input.name] = input.value || ''; // Initialize with provided values or empty strings
    return acc;
  }, {});

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    submitMethod(data);
  };

  const renderInput = (input, index) => {
    const hasError = !!errors[input.name];

    switch (input.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <>
            <RHFTextField
              key={index}
              name={input.name}
              label={input.label}
              type={input.type}
              placeholder={input.placeholder}
              size="small"
              required={input.required}
              fullWidth
              error={hasError}
              disabled={input.disable || false}
              helperText={errors[input.name]?.message}
            />
          </>
        );

      case 'textarea':
        return (
          <>
            <RHFTextArea
              key={index}
              name={input.name}
              label={input.label}
              placeholder={input.placeholder}
              size="small"
              required={input.required}
              fullWidth
              error={hasError}
              disabled={input.disable || false}
              rows={4}
              helperText={errors[input.name]?.message}
            />
          </>
        );

      case 'select':
        return (
          <>
            <RHFSelect
              key={index}
              size="small"
              name={input.name}
              label={input.label}
              required={input.required}
              fullWidth
              error={hasError}
              helperText={errors[input.name]?.message}
            >
              {input.possibleSelectValue.map((option, i) => (
                <MenuItem key={i} value={option.itemValue}>
                  {option.selectItem}
                </MenuItem>
              ))}
            </RHFSelect>
          </>
        );

      case 'date':
        return (
          <>
            <RHFDatePicker
              key={index}
              label={input.label}
              name={input.name}
              disablePast={input.disablePast || false}
              error={hasError}
              required={input.required}
              helperText={errors[input.name]?.message}
            />
          </>
        );

      case 'radio':
        return (
          <Controller
            key={index}
            name={input.name}
            id={input.name}
            control={control}
            render={({ field }) => (
              <>
                <RadioGroup {...field}>
                  {input.possibleSelectValue.map((option, i) => (
                    <FormControlLabel
                      key={i}
                      value={option.itemValue}
                      control={<Radio />}
                      label={option.selectItem}
                    />
                  ))}
                </RadioGroup>
                {hasError && (
                  <Typography variant="body2" color="error">
                    {errors[input.name]?.message}
                  </Typography>
                )}
              </>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            key={index}
            name={input.name}
            id={input.name}
            control={control}
            render={({ field }) => (
              <>
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label={input.label}
                />
                {hasError && (
                  <Typography variant="body2" color="error">
                    {errors[input.name]?.message}
                  </Typography>
                )}
              </>
            )}
          />
        );

      default:
        return null;
    }
  };

  const renderFormInputs = () => {
    const { inputConfig, uiColumn } = form_config;
    const inputsPerColumn = Math.ceil(inputConfig.length / uiColumn);

    return (
      <Grid container spacing={2}>
        {Array.from({ length: uiColumn }).map((_, colIndex) => (
          <Grid item xs={12 / uiColumn} key={colIndex}>
            {inputConfig
              .slice(
                colIndex * inputsPerColumn,
                (colIndex + 1) * inputsPerColumn
              )
              .map((input, index) => (
                <div key={index} style={{ marginBottom: '16px' }}>
                  {renderInput(input, index)}
                </div>
              ))}
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderFormInputs()}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ marginTop: 2 }}
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};

export default DynamicForm;
