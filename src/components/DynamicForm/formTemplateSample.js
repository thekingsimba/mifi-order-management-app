export const formTemplateSample = {
  inputConfig: [
    {
      label: 'Name',
      type: 'text',
      placeholder: 'Enter your name',
      required: true,
      regexPattern: '^[A-Za-z ]+$',
      errorMessage: 'Only letters and spaces are allowed.',
    },
    {
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      regexPattern: '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$',
      errorMessage: 'Invalid email format.',
    },
    {
      label: 'Gender',
      type: 'radio',
      required: true,
      possibleSelectValue: [
        { selectItem: 'Male', itemValue: 'male' },
        { selectItem: 'Female', itemValue: 'female' },
      ],
    },
    {
      label: 'Country',
      type: 'select',
      required: true,
      possibleSelectValue: [
        { selectItem: 'USA', itemValue: 'usa' },
        { selectItem: 'Canada', itemValue: 'canada' },
      ],
    },
    {
      label: 'Agree to Terms',
      type: 'checkbox',
      required: true,
    },
    {
      label: 'Date of Birth',
      type: 'date',
      required: true,
    },
  ],
  uiColumn: 6,
};
