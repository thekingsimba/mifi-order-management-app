import { Box, Button } from '@mui/material';
import axios from 'axios';
import _get from 'lodash/get';
import { Form, Templates, Widgets } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import Ajv from 'ajv';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import CustomDatePicker from './common/CustomDatePicker';
import ObjectFieldTemplate from './common/ObjectFieldTemplate';
import { errorTransformer, generateUiSchema } from './common/utils';
import schemaData from './data/form-data';
Widgets.DatePicker = CustomDatePicker;
const ajv = new Ajv();

const SchemaForm = ({
  name,
  initialData = {},
  layout = {},
  isEditMode = true,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [uiSchema, setUISchema] = useState({});
  const [initialSchema, setSchema] = useState({});
  const [key, setKey] = useState(0); // To reset the form
  const { handleShowToast } = useToast();

  const handleSubmit = ({ formData }) => {
    const validate = ajv.compile(initialSchema);
    const isValid = validate(formData);
    if (!isValid) {
      handleShowToast({
        type: 'warning',
        message: 'Please fill the form correctly!',
        title: `Invalid Data`,
      });
      return false;
    }
    if (onSubmit) {
      onSubmit(formData);
    }
    return true;
  };

  const updateListByAPi = async (currentObject) => {
    const response = await axios.get(currentObject.listByApi.url, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json',
    });
    if (response.data) {
      let enumData = [];
      let enumNamesData = [];
      (response.data || []).forEach((obj) => {
        const valueField = _get(obj, _get(currentObject, 'listByApi.valueField')) || '';
        const labelField = _get(obj, _get(currentObject, 'listByApi.labelField')) || '';
        if (valueField && labelField) {
          enumData.push(valueField + '');
          enumNamesData.push(labelField)
        }
      });
      if (enumData.length && enumNamesData.length) {
        currentObject.enum = enumData;
        currentObject.enumNames = enumNamesData;
      }
    }
    return currentObject;
  }


  const masterData = {
    names: [
      {
        code: 'A',
        name: 'A'
      },
      {
        code: 'B',
        name: 'B'
      }
    ]
  }
  const updateListeByDb = async (currentObject) => {
    const responsePath = _get(currentObject, 'listByDb.masterDataPath')
    let response = []
    if (responsePath && masterData[responsePath]) {
      response = masterData[responsePath]
    }
    if (response.length) {
      let enumData = [];
      let enumNamesData = [];
      (response || []).forEach((obj) => {
        const valueField = _get(obj, _get(currentObject, 'listByDb.valueField')) || '';
        const labelField = _get(obj, _get(currentObject, 'listByDb.labelField')) || '';
        if (valueField && labelField) {
          enumData.push(valueField + '');
          enumNamesData.push(labelField)
        }
      });
      if (enumData.length && enumNamesData.length) {
        currentObject.enum = enumData;
        currentObject.enumNames = enumNamesData;
      }
    }
    return currentObject;
  }

  const findObjectsWithKey = async (obj, key) => {
    async function recursiveSearch(currentObj) {
      if (typeof currentObj !== 'object' || currentObj === null) {
        return;
      }
      if (currentObj.hasOwnProperty(key) && key === 'listByApi') {
        await updateListByAPi(currentObj);
      } else if (currentObj.hasOwnProperty(key) && key === 'listByDb') {
        await updateListeByDb(currentObj)
      }
      for (let prop in currentObj) {
        if (currentObj.hasOwnProperty(prop)) {
          recursiveSearch(currentObj[prop]);
        }
      }
    }
    recursiveSearch(obj);
  }

  const init = async () => {
    let schema = schemaData && schemaData[name];
    await findObjectsWithKey(schema.properties, 'listByApi');
    await findObjectsWithKey(schema.properties, 'listByDb');
    setSchema(schema);
    setUISchema(generateUiSchema(schema));
  }

  useEffect(() => {
    init();
  }, []);


  const handleReset = () => {
    setFormData(initialData);
    setKey(key + 1);
  };

  const handleChange = ({ formData }) => {
    setFormData(formData);
  };

  const getObjectFieldTemplate = useCallback(
    (props) => (
      <ObjectFieldTemplate
        props={props}
        layout={layout}
        isEditMode={isEditMode}
      />
    ),
    [isEditMode]
  );

  const customErrorTransformer = (errors) => {
    return errorTransformer(errors, initialSchema);
  };

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Form
        key={key} // Key changes when form needs to be reset
        schema={initialSchema}
        uiSchema={uiSchema}
        widgets={Widgets}
        formData={formData}
        validator={validator}
        onChange={handleChange}
        onSubmit={handleSubmit}
        showErrorList={false}
        transformErrors={customErrorTransformer}
        templates={{
          ...Templates,
          ObjectFieldTemplate: getObjectFieldTemplate,
        }}
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            mt: 2,
          }}
        >
          <Button
            type="button"
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={handleReset}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Form>
    </Box>
  );
};

export default SchemaForm;
