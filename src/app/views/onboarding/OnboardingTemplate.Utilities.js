import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

// eslint-disable-next-line import/prefer-default-export
export const useSmallScreen = () => useMediaQuery('(max-width: 960px)');
