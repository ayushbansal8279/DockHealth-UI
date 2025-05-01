import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { formatEllipsisText } from 'helpers/formatters';
import { Grid } from '@mui/material';

interface Props {
  label: string;
  value: string;
  ellipsis?: boolean;
}

export default function Field({ label, value, ellipsis }: Props) {
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
    setTimeout(() => {
      setCopied(false);
    }, 400);
  };

  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
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
          <Button
            variant="text"
            onClick={copyToClipboard}
            sx={{
              textTransform: 'none',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              textAlign: 'left',
              maxWidth: '100%',
              display: 'inline-block'
            }}
          >
            {valueToShow || 'Empty'}
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
