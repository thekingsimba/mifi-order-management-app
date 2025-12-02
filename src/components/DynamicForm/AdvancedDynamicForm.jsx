import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ListItemText,
  ListItemIcon,
  Grid,
  DialogContentText,
} from "@mui/material";
import _get from "lodash/get";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { getYupSchemaFromJson } from "./utlis";
import constants from "./constants";

// Generate yup validation schema from form configuration

const FormField = React.memo(({ field, control, errors, onFieldSelect }) => {
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Grid container direction="row" spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id={field.name}
                    type={field.type}
                    label={field.label}
                    onChange={onChange}
                    onBlur={onBlur}
                    inputRef={ref}
                    value={value || ""}
                    error={!!errors[field.name]}
                    helperText={errors[field.name]?.message}
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: !!value,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {field?.model?.enable && (
                            <IconButton
                              edge="end"
                              onClick={() => {
                                onFieldSelect(field);
                              }}
                            >
                              <InfoIcon color="primary" />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
          />
        );
      case "checkbox":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={onChange}
                    onBlur={onBlur}
                    checked={value}
                    inputRef={ref}
                  />
                }
                label={field.label}
              />
            )}
          />
        );
      case "radio":
        return (
          <>
            {field.label}
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <RadioGroup
                  onChange={onChange} value={value} ref={ref}>
                  {field.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              )}
            />
          </>

        );
      case "select":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                label={field.label}
                placeholder={field.placeholder}
                onChange={onChange}
                value={value}
                inputRef={ref}
                error={!!errors[field.name]}
                fullWidth
              >
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        );
      case "multiselect":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                label={field.label}
                placeholder={field.placeholder}
                multiple
                value={value || []}
                onChange={onChange}
                inputRef={ref}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {selected.map((val) => (
                      <Chip
                        key={val}
                        label={
                          field.options.find((option) => option.value === val)
                            ?.label || val
                        }
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
                error={!!errors[field.name]}
                fullWidth
              >
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <ListItemIcon>
                      <Checkbox checked={value?.includes(option.value)} />
                    </ListItemIcon>
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormControl component="fieldset" error={!!errors[field.name]} fullWidth>
      {["select", "multiselect"].includes(field.type) && (
        <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
      )}
      {renderField()}
      {errors[field.name] && constants.complexErrorTypes.includes(field.type) && (
        <FormHelperText error>{errors[field.name]?.message}</FormHelperText>
      )}
    </FormControl>
  );
});

const AdvancedDynamicForm = React.memo(({ defaultValues = {}, config = [] }) => {
  let formConfig = config.map((element) => {
    return getYupSchemaFromJson(element);
  });
  const validationSchema = yup.object(
    formConfig.reduce((schema, field) => {
      schema[field.name] = field.validation;
      return schema;
    }, {})
  );
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const [isOpen, setOpen] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const [currentField, setField] = useState({});
  const [formData, setFormData] = useState({});

  const onClearForm = () => {
    reset();
  };

  const onFieldSelect = (field) => {
    setField(field);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowSelect = (row) => {
    if (currentField?.model?.name) {
      setValue(currentField?.model?.name, _get(row, currentField?.model?.path));
    }
    handleClose();
  };

  const closeConfirm = () => {
    setConfirm(false);
  };
  const finalConfirm = () => {
    console.log(formData);
  };

  useEffect(() => {
    if (Object.keys(formData).length) {
      setConfirm(true);
    }
  }, [formData]);

  const data = [
    { id: 1, email: "user1@example.com", name: "User One", mobileNumber: "090233442" },
    { id: 2, email: "user2@example.com", name: "User Two", mobileNumber: "0103321211232" },
    { id: 3, email: "user3@example.com", name: "User Three", mobileNumber: "056666342" },
  ];

  return (
    <Box sx={{ mx: "auto", p: 3 }}>
      <form onSubmit={handleSubmit(setFormData)}>
        <Grid container spacing={2}>
          {formConfig.map((field) => (
            <Grid item xs={12} key={field.name}>
              <FormField
                field={field}
                control={control}
                errors={errors}
                onFieldSelect={onFieldSelect}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              spacing={2}
            >
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={onClearForm}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={handleClose}
          maxWidth={currentField?.model?.maxWidth} // Change this to 'xs', 'md', 'lg', 'xl' or false to see different sizes
          fullWidth={true} // This makes the dialog take the full width of the specified maxWidth
        >
          {currentField?.model?.title && (
            <DialogTitle>{currentField?.model?.title}</DialogTitle>
          )}
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Number</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.mobileNumber}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleRowSelect(row)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {isConfirm && (
        <div>
          <Button variant="outlined" color="primary">
            Open Confirmation Dialog
          </Button>
          <Dialog
            open={isConfirm}
            onClose={closeConfirm}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
          >
            <DialogTitle id="confirmation-dialog-title">
              {"Confirm Action"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="confirmation-dialog-description">
                Are you sure you want to perform this action? This action cannot
                be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeConfirm} color="secondary">
                Cancel
              </Button>
              <Button onClick={finalConfirm} color="primary" autoFocus>
                Confirms
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Box>
  );
});

export default AdvancedDynamicForm;
