import React, { FC, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { formatEllipsisText } from 'helpers/formatters';

interface FieldProps {
  label: string;
  value: string;
  ellipsis?: boolean;
}

const Field: FC<FieldProps> = ({ label, value, ellipsis }) => {
  const [copied, setCopied] = useState(false);
  const valueToShow = ellipsis ? formatEllipsisText(value) : value;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(value ?? '')
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        console.error('Unable to copy text to clipboard', err);
      });
  };

  const handleMouseOut = () => {
    setCopied(false);
  };

  return (
    <Box display="flex" alignItems="center" marginY={1}>
      <Typography sx={{ width: '120px' }}>{label}</Typography>
      <Tooltip
        title={copied ? 'Copied!' : 'Click to Copy'}
        placement="top"
        arrow
        disableInteractive
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -10],
                },
              },
            ],
          },
        }}
        onMouseOut={handleMouseOut}
      >
        <Button variant="text" onClick={copyToClipboard}>
          {valueToShow || 'Empty'}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default Field;
