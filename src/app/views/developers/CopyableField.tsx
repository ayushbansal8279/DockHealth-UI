import React from 'react';
import { Tooltip } from '@mui/material';
import { DetailItem, StrongLabel, FieldValue, IdentifierItem, IdentifierLabel } from './styled';

interface CopyableFieldProps {
  label: string;
  value: string;
  fieldKey: string;
  copiedField: string | null;
  onCopy: (text: string, fieldKey: string) => void;
  formatValue?: (value: string) => string | null;
  variant?: 'default' | 'identifier';
}

const CopyableField: React.FC<CopyableFieldProps> = ({
  label,
  value,
  fieldKey,
  copiedField,
  onCopy,
  formatValue,
  variant = 'default',
}) => {
  const displayValue = formatValue ? (formatValue(value) ?? value) : value;
  const isCopied = copiedField === fieldKey;

  const tooltipContent = (
    <Tooltip
      title={isCopied ? 'Copied!' : `Click to copy ${label.toLowerCase()}`}
      placement="top"
      arrow
    >
      <FieldValue onClick={() => onCopy(value, fieldKey)}>
        {displayValue || 'Not specified'}
      </FieldValue>
    </Tooltip>
  );

  if (variant === 'identifier') {
    return (
      <IdentifierItem>
        <IdentifierLabel>{label}</IdentifierLabel>
        {tooltipContent}
      </IdentifierItem>
    );
  }

  return (
    <DetailItem>
      <StrongLabel>{label} </StrongLabel>
      {tooltipContent}
    </DetailItem>
  );
};

export default CopyableField;

