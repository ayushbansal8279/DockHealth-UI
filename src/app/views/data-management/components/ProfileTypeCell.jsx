import { Box, Chip, useMediaQuery, useTheme } from '@mui/material';

function getVisibleProfileTypeNames(profileTypeNames, isSmallScreen) {
  if (!profileTypeNames || profileTypeNames.length === 0) {
    return { visibleNames: [], moreCount: 0 };
  }

  const baseMaxNames = isSmallScreen ? 1 : 2;

  if (profileTypeNames.length <= baseMaxNames) {
    return { visibleNames: [...profileTypeNames], moreCount: 0 };
  }

  let visibleNames = profileTypeNames.slice(0, baseMaxNames);

  const totalLength = visibleNames.reduce(
    (sum, name) => sum + (name?.length || 0),
    0,
  );

  const LENGTH_THRESHOLD = isSmallScreen ? 18 : 24;

  if (totalLength > LENGTH_THRESHOLD && baseMaxNames > 1) {
    visibleNames = [profileTypeNames[0]];
  }

  const moreCount = profileTypeNames.length - visibleNames.length;

  return { visibleNames, moreCount };
}

export function ProfileTypeCell({ profileTypeNames }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { visibleNames, moreCount } = getVisibleProfileTypeNames(
    profileTypeNames,
    isSmallScreen,
  );

  if (visibleNames.length === 0) return '';

  const chipSx = {
    backgroundColor: '#F3F5F6',
    borderRadius: '6px',
    padding: '16px 0px',
    border: '1px solid transparent',
    '.MuiDataGrid-row:hover &': {
      border: '1px solid #D0D7DE',
    },
  };

  return (
    <Box display="flex" alignItems="center" height="100%" gap={1}>
      {visibleNames.map((name, index) => (
        <Chip key={index} label={name} sx={chipSx} />
      ))}

      {moreCount > 0 && <Chip label={`+${moreCount}`} sx={chipSx} />}
    </Box>
  );
}
