import _get from 'lodash/get';

export const generateUiSchema = (schema) => {
    const uiSchema = {};
    Object.keys(schema.properties).forEach((key) => {
        const property = schema.properties[key];
        if (property.widgetType === 'checkboxes') {
            uiSchema[key] = {
                'ui:widget': property.widgetType,
                'ui:options': {
                    inline: true,
                }
            };
        } else if (property.widgetType) {
            uiSchema[key] = { 'ui:widget': property.widgetType };
        }
        if (property.inputType) {
            uiSchema[key] = uiSchema[key] || {};
            uiSchema[key]['ui:options'] = { inputType: property.inputType };
        }
    });
    return uiSchema;
};

export const errorTransformer = (errors = [], initialSchema) => {
    return errors.map((error) => {
        const { errorMessage = {} } =
            _get(initialSchema, `properties${error.property}`) || {};
        if (error.name === 'required') {
            error.message = 'This field is required!';
        }
        if (error.name === 'pattern' && errorMessage.pattern) {
            error.message = errorMessage.pattern;
        }
        if (error.name === 'required' && errorMessage.required) {
            error.message = errorMessage.required;
        }
        if (error.name === 'minLength' && errorMessage.minLength) {
            error.message = errorMessage.minLength;
        }
        return error;
    });
};
