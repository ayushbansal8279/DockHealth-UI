import { replace, toUpper } from 'ramda';

export const capitalize = replace(/^./, toUpper);

export const capitalizeWords = replace(/\b\w/g, toUpper);

export default capitalize;
