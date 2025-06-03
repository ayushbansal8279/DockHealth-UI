import React, { useEffect, useState } from 'react';
import { Box, Chip } from '@mui/material';
import Tooltip from '../Tooltip/Tooltip';

const PatientListLabels = ({
  labels = [],
  width = 0,
  font = '14px Outfit',
}) => {
  const [visibleCount, setVisibleCount] = useState(labels?.length);

  const getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const width = context.measureText(text).width;
    return Math.floor(width);
  };

  useEffect(() => {
    if (!width || !labels?.length) return;

    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < labels?.length; i++) {
      const text = labels[i]?.labelName || '';
      const textWidth = getTextWidth(text, font);

      const chipTotalWidth = textWidth;

      if (totalWidth + chipTotalWidth > width) break;

      totalWidth += chipTotalWidth;
      count++;
    }

    setVisibleCount(count);
  }, [labels, width]);

  const visibleLabels = labels?.slice(0, visibleCount);
  const hiddenLabels = labels?.slice(visibleCount);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '2px',
        overflow: 'hidden',
        flexWrap: 'nowrap',
        width,
      }}
    >
      {visibleLabels?.map((label) => (
        <Tooltip title={label?.labelName} key={label?.labelIdentifier}>
          <Chip
            label={label?.labelName}
            sx={{
              minWidth: 50,
              maxWidth: 120,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          />
        </Tooltip>
      ))}

      {hiddenLabels.length > 0 && (
        <Tooltip
          title={hiddenLabels?.map((l) => l?.labelName).join(', ')}
          key="more-chip"
        >
          <Chip label={`+${hiddenLabels?.length}`} />
        </Tooltip>
      )}
    </Box>
  );
};

export default PatientListLabels;
