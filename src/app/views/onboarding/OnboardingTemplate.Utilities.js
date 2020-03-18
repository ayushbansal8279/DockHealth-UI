import { useMediaQuery } from '@material-ui/core';

// eslint-disable-next-line import/prefer-default-export
export const useSmallScreen = () => useMediaQuery('(max-width: 960px)');
