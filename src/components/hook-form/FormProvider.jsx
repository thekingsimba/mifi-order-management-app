import { FormProvider as CustomForm } from 'react-hook-form';

export default function FormProvider({
  children,
  onSubmit,
  methods,
  formId = '',
}) {
  return (
    <CustomForm {...methods}>
      <form onSubmit={onSubmit} id={formId}>
        {children}
      </form>
    </CustomForm>
  );
}
