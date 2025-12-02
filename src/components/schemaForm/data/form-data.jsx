export default {
  'custom-form': {
    title: 'A Registration Form',
    type: 'object',
    required: [
      'firstName',
      'lastName',
      'dropdownField',
      'dropdownField1',
      'radio',
      'checkbox1',
    ],
    properties: {
      firstName: { type: 'string', title: 'First name', default: 'Chuck' },
      lastName: { type: 'string', title: 'Last name', minLength: 10 },
      age: { type: 'integer', title: 'Age', widgetType: 'updown' },
      password: {
        type: 'string',
        title: 'Password',
        minLength: 3,
        widgetType: 'password',
      },
      telephone: {
        type: 'string',
        title: 'Telephone',
        minLength: 10,
        inputType: 'tel',
        errorMessage: {
          pattern: 'Enter a Valid telephone',
          required: 'telephone is Required',
        },
      },
      dropdownField: {
        widgetType: 'select',
        type: 'string',
        title: 'Select an Option',
        enum: ['', '1', '2', '3'],
        enumNames: ['select', 'Option 1', 'Option 2', 'Option 3'],
        default: '4',
        listByApi: {
          url: 'https://jsonplaceholder.typicode.com/todos',
          method: 'GET',
          queryParams: [
            {
              keyName: 'firstName',
              valuePath: 'firstName',
            },
          ],
          valueField: 'id',
          labelField: 'title',
        },
        listByDb: {
          masterDataPath: 'names',
          valueField: 'code',
          labelField: 'name',
        },
      },
      dropdownField1: {
        widgetType: 'select',
        type: 'string',
        title: 'Select an Option',
        enum: ['', '1', '2', '3'],
        enumNames: ['select', 'Option 1', 'Option 2', 'Option 3'],
        default: '4',
        listByApi: {
          url: 'https://jsonplaceholder.typicode.com/todos',
          method: 'GET',
          queryParams: [
            {
              keyName: 'firstName',
              valuePath: 'firstName',
            },
          ],
          valueField: 'id',
          labelField: 'title',
        }
      },
      dropdownField2: {
        widgetType: 'select',
        type: 'string',
        title: 'Select an Option',
        enum: ['', '1', '2', '3'],
        enumNames: ['select', 'Option 1', 'Option 2', 'Option 3'],
        default: '4',
        listByApi: {
          url: 'https://jsonplaceholder.typicode.com/todos',
          method: 'GET',
          queryParams: [
            {
              keyName: 'firstName',
              valuePath: 'firstName',
            },
          ],
          valueField: 'id',
          labelField: 'title',
        },

        listByDb : {
          masterDataPath : 'names',
          valueField: 'code',
          labelField: 'name',
        }
      },
      radio: {
        widgetType: 'radio',
        type: 'string',
        title: 'Choose one',
        enum: ['Choice 1', 'Choice 2', 'Choice 3'],
      },
      checkbox1: {
        widgetType: 'checkboxes',
        type: 'array',
        title: 'Pick some',
        items: {
          type: 'string',
          enum: ['Item 1', 'Item 2', 'Item 3'],
        },
        uniqueItems: true,
        minItems: 1,
      },
      startDateTime: {
        title: 'Start Date',
        type: 'string',
        format: 'date',
        minDate: {
          value: '1',
          unit: 'month',
          add: true,
        },
      },
      bio: {
        type: 'string',
        title: 'Bio',
        widgetType: 'textarea',
        layout: {
          rootSpacing: 12,
          xl: 12,
          lg: 12,
          md: 12,
          sm: 12,
          xs: 12,
        },
      },
    },
  },
};
