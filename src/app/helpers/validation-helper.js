/* eslint-disable import/prefer-default-export */
import { string } from 'yup';

export const validPasswordSchema = string()
  .min(8, 'At least 8 characters are required in the password')
  .matches(/\d/, 'At least one number is required in the password')
  .matches(/[A-Z]/, 'At least one uppercase letter is required in the password')
  .matches(
    /[a-z]/,
    'At least one lowercase letter is required in the password',
  );
