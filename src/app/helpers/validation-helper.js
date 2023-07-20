import { string } from 'yup';

export const validPasswordSchema = string()
  .min(8, 'At least 8 characters are required in the password')
  .matches(/\d/, 'At least one number is required in the password')
  .matches(/[A-Z]/, 'At least one uppercase letter is required in the password')
  .matches(
    /[a-z]/,
    'At least one lowercase letter is required in the password',
  );

export const validateNewSubtask = (value) => {
  if ([...value]?.filter((char) => char !== ' ').length < 2)
    return 'The subtask description is too short (min. 2 characters)';

  return null;
};

export const validateEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(
      /^[\w!#$%&'*+./=?^`{|}~-]+@[\dA-Za-z](?:[\dA-Za-z-]{0,61}[\dA-Za-z])?(?:\.[\dA-Za-z](?:[\dA-Za-z-]{0,61}[\dA-Za-z])?)*$/,
    );
