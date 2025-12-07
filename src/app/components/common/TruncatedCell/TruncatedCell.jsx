import React from 'react';
import Tooltip from '../Tooltip/Tooltip';
import { TruncatedSpan } from './styled';

const TruncatedCell = ({ content, tooltipText, placement = 'top' }) => {
  const title = tooltipText || (typeof content === 'string' ? content : '');

  return (
    <Tooltip placement={placement} title={title}>
      <TruncatedSpan>{content}</TruncatedSpan>
    </Tooltip>
  );
};

export const renderTruncatedCell = (content, tooltipText) => (
  <TruncatedCell content={content} tooltipText={tooltipText} />
);

export default TruncatedCell;