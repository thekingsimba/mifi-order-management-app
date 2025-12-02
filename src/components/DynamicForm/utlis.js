import * as yup from "yup";

export const getYupSchemaFromJson = (jsonSchema) => {
  let schemaField = jsonSchema;
  switch (schemaField.type) {
    case "text":
    case "password":
    case "radio":
      let stringField = yup.string();
      if (schemaField.minLength) {
        stringField = stringField.min(
          schemaField.minLength,
          schemaField.invalidMessagess
        );
        schemaField.validation = stringField;
      }
      if (schemaField.required) {
        stringField = stringField.required(schemaField.message);
        schemaField.validation = stringField;
      }
      break;
    case "email":
      let emailField = yup.string();
      emailField = emailField.email(
        schemaField.invalidMessage || "Invalid email"
      );
      if (schemaField.minLength) {
        emailField = emailField.min(
          schemaField.minLength,
          schemaField.invalidMessage
        );
      }
      if (schemaField.required) {
        emailField = emailField.required(schemaField.message);
      }
      schemaField.validation = emailField;
      break;
    case "number":
      let numberField = yup.number();
      if (schemaField.positive) {
        numberField = numberField.positive(
          schemaField.positiveMessage || "Must be positive"
        );
        schemaField.validation = numberField;
      }
      if (schemaField.integer) {
        numberField = numberField.integer(
          schemaField.integerMessage || "Must be an integer"
        );
        schemaField.validation = numberField;
      }
      if (schemaField.required) {
        numberField = numberField.required(schemaField.message);
        schemaField.validation = numberField;
      }
      break;

    case "checkbox":
      let booleanField = yup.boolean();
      if (schemaField.oneOf) {
        booleanField = booleanField.oneOf(
          schemaField.oneOf,
          schemaField.invalidMessage
        );
        schemaField.validation = booleanField;
      }
      break;

    case "multiselect":
      let arrayField = yup.array();
      if (schemaField.minItems) {
        arrayField = arrayField.min(schemaField.minItems, schemaField.message);
        schemaField.validation = arrayField;
      }
      if (schemaField.required) {
        arrayField = arrayField.required(schemaField.message);
        schemaField.validation = arrayField;
      }
      break;
    default:
      if (schemaField.required) {
        schemaField.validation = yup.string().required(schemaField.message);
      }
  }
  return schemaField;
};
