import React, { useState } from 'react';
import { Typography, Button, Tooltip, Grid, TextField } from '@mui/material';
import { formatEllipsisText } from 'helpers/formatters';

interface Props {
  label: string;
  value: string;
  ellipsis?: boolean;
  editable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function IntegrationFields({
  label,
  value,
  ellipsis,
  editable = false,
  onChange,
}: Props) {
  const [copied, setCopied] = useState(false);
  const valueToShow = ellipsis ? formatEllipsisText(value) : value;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(value ?? '')
      .then(() => setCopied(true))
      .catch((err) => console.error('Unable to copy text to clipboard', err));
  };

  const handleMouseOut = () => {
    setTimeout(() => setCopied(false), 400);
  };

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
      <Grid item xs={12} md={4}>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        {editable ? (
          <TextField
            value={value}
            onChange={onChange}
            size="small"
            variant="outlined"
            sx={{ maxWidth: 500 }}
          />
        ) : (
          <Tooltip
            title={copied ? 'Copied!' : 'Click to Copy'}
            placement="top"
            arrow
            onMouseOut={handleMouseOut}
          >
            <Button
              variant="text"
              onClick={copyToClipboard}
              sx={{ textTransform: 'none' }}
            >
              {valueToShow || 'Empty'}
            </Button>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  );
}
