import { sort } from 'ramda';

/* eslint-disable import/prefer-default-export */
export const BOOL_SELECT_OPTIONS = [
  {
    value: null,
    label: 'None',
  },
  {
    value: 'no',
    label: 'No',
  },
  {
    value: 'yes',
    label: 'Yes',
  },
];

export const sortAlphabetical = array =>
  sort((a, b) => a?.name.localeCompare(b), array);
