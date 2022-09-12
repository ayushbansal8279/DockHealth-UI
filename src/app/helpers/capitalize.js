import replace from 'ramda/src/replace';
import toUpper from 'ramda/src/toUpper';

export const capitalize = replace(/^./, toUpper);

export const capitalizeWords = replace(/\b\w/g, toUpper);

export default capitalize;
